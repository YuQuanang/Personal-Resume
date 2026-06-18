/**
 * seed.js — One-time Supabase vector database seeder
 *
 * Run once after setting up your .env and Supabase schema:
 *   node seed.js
 *
 * What it does:
 *   1. Reads resume.pdf and chunks the text into ~1,000-char sentence-aware pieces.
 *   2. Merges those chunks with a hardcoded personalFacts[] array for context
 *      not captured by the resume (hobbies, personal brand, extra details).
 *   3. Generates NVIDIA NV-EmbedQA-E5-v5 embeddings (4096-dim) for every chunk.
 *   4. Upserts all { content, embedding } rows into Supabase portfolio_documents.
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// pdfjs-dist has proper ESM support and works with Node 22
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Validate Environment ───────────────────────────────────────────────────
const { NVIDIA_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
if (!NVIDIA_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌  Missing environment variables. Copy .env.example → .env and fill in values.');
  process.exit(1);
}

// ─── Clients ────────────────────────────────────────────────────────────────
// Use the service_role key so we can write to the table (bypasses RLS).
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── Personal Facts Hardcoded Array ─────────────────────────────────────────
// This is additional context that a PDF resume may not capture well —
// personal brand, hobbies, personality, extra details.
// Update this array with anything you want the bot to know about yourself.
const personalFacts = [
  "My name is Yu Quan Ang. I go by Walter among friends. I am a 25-year-old Computer Science and Business graduate from Nanyang Technological University (NTU), Singapore.",
  "I graduated from NTU in May 2026 with a BSc in Computer Science with a Second Major in Business. My GPA is 4.37 out of 5.0.",
  "I am currently open to full-time opportunities in software engineering, data analytics, product management, and systems analysis roles.",
  "I am based in Singapore. My email is angyuquan12@gmail.com and my phone number is +65 9868 1152.",
  "I am a competitive golfer with a personal best score of 73. Golf has taught me patience, precision, strategic thinking, and mental discipline — qualities I bring to my professional work.",
  "I served as President of the NTU Golf Club, leading and organising events and tournaments for over 200 members. I focused on building an inclusive and improvement-oriented team culture.",
  "I am a landscape and golf course photographer. I shoot with an Olympus Micro Four Thirds camera system. My photography Instagram is @walterquanpics.",
  "My personal Instagram is @walterquan_. I document my golf and lifestyle there.",
  "I am the founder of Rangefinder Studio, a creative studio focused on golf photography and visual storytelling.",
  "I am passionate about Web3 and blockchain technology. I have built and deployed decentralised applications (dApps) on the Arbitrum network, including smart contract-based reward systems.",
  "I have strong interest in Systems Analysis and Product Management — understanding how complex technical systems fit together and bridging business strategy with technical execution.",
  "During my internship at Synexe (January 2025 – June 2025), I worked as a System Analyst Intern. I led the system integration of the NGEMR platform with SingHealth's Queue Management System, coordinating across multiple stakeholder groups. I reduced implementation delays by 20% against baseline KPIs through parallel workstream management and process optimisation.",
  "During my internship at the Land Transport Authority (May 2024 – July 2024), I worked as a Data Analyst Intern. I built Python-powered dashboards for operational data visualisation, automated legacy data pipelines, and presented analytical findings to engineering and senior management teams.",
  "During my internship at NETS (February 2022 – July 2022), I worked as a UAT Tester. I diagnosed and evaluated UAT systems, wrote structured test cases, managed test data in Excel, and documented defects that led to multiple system improvements.",
  "My technical skills include: Python, JavaScript, TypeScript, SQL, Solidity, React, Node.js, Express, Vite, HTML, CSS, GSAP, Lenis, data pipelines, system integration, UAT testing, Excel, and blockchain development.",
  "I have experience with healthcare IT systems, government data systems, enterprise software integration, and full-stack web development.",
  "My professional strengths are cross-functional communication, stakeholder management, waterfall and agile project methodologies, and translating technical requirements into clear business outcomes.",
  "My LinkedIn profile is: https://www.linkedin.com/in/yuquanang/",
  "My GitHub profile is: https://github.com/YuQuanang",
  "I have built a personal portfolio website using React, Vite, GSAP animations, and Lenis smooth scrolling — demonstrating my frontend engineering skills.",
];

// ─── Text Chunking ───────────────────────────────────────────────────────────

/**
 * cleanPdfText — removes messy PDF whitespace artifacts.
 * PDFs often produce runs of spaces, hyphenated line-breaks, and random newlines.
 */
function cleanPdfText(raw) {
  return raw
    .replace(/(\w)-\n(\w)/g, '$1$2')   // rejoin hyphenated line breaks
    .replace(/\n{3,}/g, '\n\n')         // collapse 3+ newlines to paragraph break
    .replace(/[ \t]{2,}/g, ' ')         // collapse runs of spaces/tabs
    .replace(/\n /g, '\n')              // remove leading spaces after newlines
    .trim();
}

/**
 * chunkBySentence — splits text into chunks of ~targetSize characters.
 * Uses sentence boundaries (. ! ?) as split points so we never cut mid-sentence.
 * Each chunk contains complete sentences and stays close to targetSize chars.
 */
function chunkBySentence(text, targetSize = 1000) {
  // Split on sentence-ending punctuation followed by whitespace or end-of-string.
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let current = '';

  for (const sentence of sentences) {
    if (!sentence.trim()) continue;

    // If adding this sentence would exceed targetSize AND we already have content,
    // flush the current chunk and start a new one.
    if (current.length + sentence.length > targetSize && current.length > 0) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }

  // Push any remaining text.
  if (current.trim()) chunks.push(current.trim());

  return chunks;
}

// ─── NVIDIA Embeddings ───────────────────────────────────────────────────────

/**
 * generateEmbeddings — calls the NVIDIA NIM embeddings API.
 * nvidia/nv-embedqa-e5-v5 produces 4096-dimensional vectors.
 * Processes in batches of 10 to stay within API rate limits.
 */
async function generateEmbeddings(texts) {
  const BATCH_SIZE = 10;
  const allEmbeddings = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    console.log(`  Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(texts.length / BATCH_SIZE)} (${batch.length} chunks)…`);

    const response = await fetch('https://integrate.api.nvidia.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'nvidia/nv-embedqa-e5-v5',
        input: batch,
        input_type: 'passage',   // 'passage' for documents to be retrieved
        encoding_format: 'float',
        truncate: 'END',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`NVIDIA API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    // data.data is an array of { index, embedding } objects.
    const sorted = data.data.sort((a, b) => a.index - b.index);
    allEmbeddings.push(...sorted.map(d => d.embedding));

    // Small delay between batches to be polite to the API.
    if (i + BATCH_SIZE < texts.length) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  return allEmbeddings;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌿  Portfolio RAG Seeder\n' + '─'.repeat(40));

  // ── Step 1: Load & chunk the resume PDF ──────────────────────────────────
  const pdfPath = path.join(__dirname, 'resume.pdf');
  let pdfChunks = [];

  if (fs.existsSync(pdfPath)) {
    console.log('📄  Reading resume.pdf…');
    const pdfBuffer = fs.readFileSync(pdfPath);
    // Load the PDF using pdfjs-dist (ESM-compatible, works on Node 22)
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) });
    const pdfDoc = await loadingTask.promise;
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    const cleanedText = cleanPdfText(fullText);
    pdfChunks = chunkBySentence(cleanedText, 1000);
    console.log(`    ✓ ${pdfChunks.length} chunks extracted from PDF`);
  } else {
    console.warn('⚠️   resume.pdf not found at project root — skipping PDF ingestion.');
    console.warn('    Place your resume at ./resume.pdf and re-run to include it.');
  }

  // ── Step 2: Combine PDF chunks with hardcoded personal facts ─────────────
  const allChunks = [...pdfChunks, ...personalFacts];
  console.log(`\n📝  Total chunks to embed: ${allChunks.length}`);
  console.log(`    (${pdfChunks.length} from PDF + ${personalFacts.length} from personalFacts[])`);

  // ── Step 3: Generate NVIDIA embeddings ───────────────────────────────────
  console.log('\n🧠  Generating NVIDIA NV-EmbedQA-E5-v5 embeddings…');
  const embeddings = await generateEmbeddings(allChunks);
  console.log(`    ✓ ${embeddings.length} embeddings generated`);

  // ── Step 4: Build rows and upsert into Supabase ──────────────────────────
  console.log('\n🗄️   Inserting into Supabase…');
  const rows = allChunks.map((content, i) => ({
    content,
    embedding: embeddings[i],
  }));

  // Insert in batches of 50 to avoid payload size limits.
  const INSERT_BATCH = 50;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += INSERT_BATCH) {
    const batch = rows.slice(i, i + INSERT_BATCH);
    const { error } = await supabase
      .from('portfolio_documents')
      .insert(batch);

    if (error) {
      console.error(`❌  Supabase insert error at batch ${i}:`, error.message);
      process.exit(1);
    }
    inserted += batch.length;
    process.stdout.write(`\r    Inserted ${inserted}/${rows.length} rows…`);
  }

  console.log(`\n\n✅  Seeding complete! ${inserted} chunks stored in portfolio_documents.`);
  console.log('    You can verify in your Supabase dashboard: Table Editor → portfolio_documents.\n');
}

main().catch(err => {
  console.error('\n❌  Fatal error:', err);
  process.exit(1);
});

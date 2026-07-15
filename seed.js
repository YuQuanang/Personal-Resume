/**
 * seed.js — Static In-Memory Vector Search Seeder
 *
 * Run once whenever you update your resume or personalFacts:
 *   node seed.js
 *
 * What it does:
 *   1. Reads resume.pdf and chunks the text into ~1,000-char sentence-aware pieces.
 *   2. Merges those chunks with a hardcoded personalFacts[] array.
 *   3. Generates NVIDIA NV-EmbedQA-E5-v5 embeddings for every chunk.
 *   4. Saves all { content, embedding } objects to netlify/functions/data/embeddings.json
 *      — a static file bundled with your deployment. No database needed!
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Validate Environment ────────────────────────────────────────────────────
const { NVIDIA_API_KEY } = process.env;
if (!NVIDIA_API_KEY) {
  console.error('❌  Missing NVIDIA_API_KEY. Copy .env.example → .env and fill in the value.');
  process.exit(1);
}

// ─── Personal Facts Hardcoded Array ─────────────────────────────────────────
// Update this array whenever you want the bot to know something new about you.
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

function cleanPdfText(raw) {
  return raw
    .replace(/(\w)-\n(\w)/g, '$1$2')   // rejoin hyphenated line breaks
    .replace(/\n{3,}/g, '\n\n')         // collapse 3+ newlines to paragraph break
    .replace(/[ \t]{2,}/g, ' ')         // collapse runs of spaces/tabs
    .replace(/\n /g, '\n')              // remove leading spaces after newlines
    .trim();
}

function chunkBySentence(text, targetSize = 1000) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let current = '';

  for (const sentence of sentences) {
    if (!sentence.trim()) continue;
    if (current.length + sentence.length > targetSize && current.length > 0) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// ─── NVIDIA Embeddings ───────────────────────────────────────────────────────

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
        input_type: 'passage',
        encoding_format: 'float',
        truncate: 'END',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`NVIDIA API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const sorted = data.data.sort((a, b) => a.index - b.index);
    // Truncate from 1024 to 256 dimensions client-side.
    // The first N dimensions of these embeddings retain strong semantic quality
    // (MRL-style truncation). This makes embeddings.json ~75% smaller.
    const DIMS = 256;
    allEmbeddings.push(...sorted.map(d => d.embedding.slice(0, DIMS)));

    // Small delay between batches to respect the API rate limit.
    if (i + BATCH_SIZE < texts.length) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  return allEmbeddings;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌿  Portfolio Embeddings Seeder (Static JSON)\n' + '─'.repeat(50));

  // ── Step 1: Load & chunk the resume PDF ─────────────────────────────────
  const pdfPath = path.join(__dirname, 'resume.pdf');
  let pdfChunks = [];

  if (fs.existsSync(pdfPath)) {
    console.log('📄  Reading resume.pdf…');
    const pdfBuffer = fs.readFileSync(pdfPath);
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

  // ── Step 2: Combine PDF chunks with hardcoded personal facts ────────────
  const allChunks = [...pdfChunks, ...personalFacts];
  console.log(`\n📝  Total chunks to embed: ${allChunks.length}`);
  console.log(`    (${pdfChunks.length} from PDF + ${personalFacts.length} from personalFacts[])`);

  // ── Step 3: Generate NVIDIA embeddings ──────────────────────────────────
  console.log('\n🧠  Generating NVIDIA NV-EmbedQA-E5-v5 embeddings…');
  const embeddings = await generateEmbeddings(allChunks);
  console.log(`    ✓ ${embeddings.length} embeddings generated`);

  // ── Step 4: Save to a static JSON file ──────────────────────────────────
  const outputDir = path.join(__dirname, 'netlify', 'functions', 'data');
  const outputPath = path.join(outputDir, 'embeddings.json');

  // Ensure the data directory exists.
  fs.mkdirSync(outputDir, { recursive: true });

  const payload = allChunks.map((content, i) => ({
    content,
    embedding: embeddings[i],
  }));

  fs.writeFileSync(outputPath, JSON.stringify(payload));
  const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log(`\n✅  Done! Saved ${payload.length} chunks → ${outputPath} (${sizeKB} KB)`);
  console.log('    Commit this file and redeploy Netlify — no database needed! 🚀\n');
}

main().catch(err => {
  console.error('\n❌  Fatal error:', err);
  process.exit(1);
});

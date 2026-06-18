-- ═══════════════════════════════════════════════════════════
--  PORTFOLIO RAG — Supabase Schema (v2)
--  Run this entire script in your Supabase SQL Editor.
--  It is safe to re-run — drops and recreates the table.
-- ═══════════════════════════════════════════════════════════

-- Step 1: Enable the pgvector extension.
create extension if not exists vector with schema extensions;

-- Step 2: Drop and recreate the table with correct 1024-dim vectors.
-- nvidia/nv-embedqa-e5-v5 returns 1024-dimensional vectors via the NIM API.
drop table if exists portfolio_documents cascade;
create table portfolio_documents (
  id        uuid primary key default gen_random_uuid(),
  content   text         not null,
  embedding vector(1024) not null
);

-- Step 3: Create an ivfflat index (ivfflat supports up to 2000 dims — 1024 is fine).
create index portfolio_documents_embedding_idx
  on portfolio_documents
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Step 4: Cosine similarity search function used by the backend.
--   match_threshold: semantic firewall — queries scoring below this return nothing.
--   match_count: max chunks to retrieve (caps context window size).
create or replace function match_portfolio_documents(
  query_embedding  vector(1024),
  match_threshold  float default 0.75,
  match_count      int   default 5
)
returns table (
  id         uuid,
  content    text,
  similarity float
)
language sql stable
as $$
  select
    portfolio_documents.id,
    portfolio_documents.content,
    1 - (portfolio_documents.embedding <=> query_embedding) as similarity
  from portfolio_documents
  where 1 - (portfolio_documents.embedding <=> query_embedding) > match_threshold
  order by portfolio_documents.embedding <=> query_embedding
  limit match_count;
$$;

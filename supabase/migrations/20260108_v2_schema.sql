-- Enable Vector Extension for RAG
create extension if not exists vector;

-- 1. Project Insights (Dynamic Feed)
create table if not exists project_insights (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  type text not null check (type in ('warning', 'encouragement', 'strategy', 'milestone')),
  content text not null,
  action_label text, -- Optional: "Read Guide"
  action_url text,   -- Optional: "/dashboard/guides/..."
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Index for fetching unread insights
create index idx_insights_project_unread on project_insights(project_id) where is_read = false;


-- 2. Chat Sessions (The Companion Memory)
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default 'New Chat',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Chat Messages
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references chat_sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system', 'data')),
  content text not null,
  tool_calls jsonb, -- For storing specific AI actions taken
  created_at timestamptz default now()
);

-- Index for loading chat history
create index idx_messages_session on chat_messages(session_id asc, created_at asc);


-- 4. Knowledge Base (for RAG)
create table if not exists documents (
  id bigserial primary key,
  content text,
  metadata jsonb,
  embedding vector(1536) -- dimensions for text-embedding-3-small
);

-- 5. Vector Search Function
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;

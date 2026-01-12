-- Optimizing RLS Joins by indexing Foreign Keys
-- "Missing indexes on RLS columns are the #1 cause of dashboard slowness"

-- 1. Projects (Already indexed on user_id usually via PK/Unique, but ensuring)
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);

-- 2. Canvas Nodes (Used in RLS for Tasks: JOIN projects ON projects.id = canvas_nodes.project_id)
CREATE INDEX IF NOT EXISTS idx_canvas_nodes_project_id ON canvas_nodes(project_id);

-- 3. Tasks (Used in RLS: JOIN canvas_nodes ON canvas_nodes.id = tasks.node_id)
CREATE INDEX IF NOT EXISTS idx_tasks_node_id ON tasks(node_id);

-- 4. Project Insights
CREATE INDEX IF NOT EXISTS idx_project_insights_project_id ON project_insights(project_id);

-- 5. Chat Messages (Used in RLS: JOIN chat_sessions ON ...)
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);

-- 6. Chat Sessions
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
-- Also often queried by project context
CREATE INDEX IF NOT EXISTS idx_chat_sessions_project_id ON chat_sessions(project_id);

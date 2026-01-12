-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 1. Projects: Users can only see and touch their own projects
CREATE POLICY "Users can fully manage their own projects"
ON projects
FOR ALL
USING (auth.uid() = user_id);

-- 2. Nodes: Access inherited via project ownership
-- Use (SELECT auth.uid()) to encourage caching of the stable function result
CREATE POLICY "Users can manage nodes in their projects"
ON canvas_nodes
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = canvas_nodes.project_id
    AND projects.user_id = (SELECT auth.uid())
  )
);

-- 3. Tasks: Access inherited via node -> project ownership
CREATE POLICY "Users can manage tasks in their projects"
ON tasks
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM canvas_nodes
    JOIN projects ON projects.id = canvas_nodes.project_id
    WHERE canvas_nodes.id = tasks.node_id
    AND projects.user_id = (SELECT auth.uid())
  )
);

-- 4. Insights: Access inherited via project ownership
CREATE POLICY "Users can read/manage their project insights"
ON project_insights
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_insights.project_id
    AND projects.user_id = (SELECT auth.uid())
  )
);

-- 5. Chat Sessions: Users own their sessions
CREATE POLICY "Users can manage their chat sessions"
ON chat_sessions
FOR ALL
USING ((SELECT auth.uid()) = user_id);

-- 6. Chat Messages: Access inherited via session ownership
CREATE POLICY "Users can manage their chat messages"
ON chat_messages
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id = chat_messages.session_id
    AND chat_sessions.user_id = (SELECT auth.uid())
  )
);

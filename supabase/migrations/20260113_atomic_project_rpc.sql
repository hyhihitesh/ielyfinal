-- Database Function: create_complete_project
-- Purpose: Wraps project, node, and task creation in a single ACID transaction.
-- Author: Piely System (Harvard Polish Phase)

create or replace function create_complete_project(
  p_user_id uuid,
  p_title text,
  p_description text,
  p_experience_level text,
  p_project_type text,
  p_technical_background text,
  p_nodes jsonb, -- Array of node objects
  p_tasks jsonb  -- Array of task objects
) returns uuid
language plpgsql
security definer -- Runs with privileges of creator (postgres) to ensure smooth execution, though policies still apply if RLS is strict
as $$
declare
  v_project_id uuid;
  v_node record;
  v_task record;
  v_inserted_node_id uuid;
begin
  -- 1. Insert Project
  insert into projects (
    user_id, title, description, experience_level, project_type, technical_background, stage
  ) values (
    p_user_id, p_title, p_description, p_experience_level, p_project_type, p_technical_background, 'idea'
  )
  returning id into v_project_id;

  -- 2. Insert Nodes
  -- We loop through the JSON array since we need to capture the NEW ID for each node
  -- to map tasks correctly if we supported complex task mapping (which we do).
  -- However, since the input JSON for tasks likely links to "linear index" or "node_id string",
  -- we need a strategy.
  -- Strategy: The input p_nodes should have the "node_id" (string) from AI.
  -- We insert, then we can insert tasks that reference that "node_id".
  
  -- Actually, a cleaner way for bulk insert is to just use jsonb_to_recordset if we didn't have the foreign key dependency on generated IDs.
  -- Since we need the generated UUID of the node to insert tasks, we must loop or use a CTE.
  
  for v_node in select * from jsonb_to_recordset(p_nodes) as x(
    node_id text,
    title text,
    description text,
    position int,
    status text,
    estimated_weeks int,
    ai_insight text
  )
  loop
    insert into canvas_nodes (
      project_id, node_id, title, description, position, status, estimated_weeks, ai_insight
    ) values (
      v_project_id, v_node.node_id, v_node.title, v_node.description, v_node.position, v_node.status, v_node.estimated_weeks, v_node.ai_insight
    )
    returning id into v_inserted_node_id;
    
    -- 3. Insert Tasks for this Node
    -- We filter the p_tasks JSONB for tasks belonging to this node_id
    insert into tasks (node_id, title, priority, completed)
    select 
      v_inserted_node_id,
      t.title,
      'medium',
      false
    from jsonb_to_recordset(p_tasks) as t(node_id text, title text)
    where t.node_id = v_node.node_id;
    
  end loop;

  return v_project_id;
end;
$$;

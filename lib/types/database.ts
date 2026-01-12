export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            projects: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string
                    experience_level: string | null
                    project_type: string | null
                    industry: string | null
                    stage: string | null
                    has_cofounder: string | null
                    technical_background: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description: string
                    experience_level?: string | null
                    project_type?: string | null
                    industry?: string | null
                    stage?: string | null
                    has_cofounder?: string | null
                    technical_background?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string
                    experience_level?: string | null
                    project_type?: string | null
                    industry?: string | null
                    stage?: string | null
                    has_cofounder?: string | null
                    technical_background?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            users: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    avatar_url: string | null
                    subscription_tier: string | null
                    subscription_status: string | null
                    polar_customer_id: string | null
                    current_period_end: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    subscription_tier?: string | null
                    subscription_status?: string | null
                    polar_customer_id?: string | null
                    current_period_end?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    subscription_tier?: string | null
                    subscription_status?: string | null
                    polar_customer_id?: string | null
                    current_period_end?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            canvas_nodes: {
                Row: {
                    id: string
                    project_id: string
                    node_id: string
                    title: string
                    description: string | null
                    position: number
                    status: string | null
                    estimated_weeks: number | null
                    ai_insight: string | null
                    content: string | null // Added content column
                    created_at: string
                }
                Insert: {
                    id?: string
                    project_id: string
                    node_id: string
                    title: string
                    description?: string | null
                    position: number
                    status?: string | null
                    estimated_weeks?: number | null
                    ai_insight?: string | null
                    content?: string | null // Added content column
                    created_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string
                    node_id?: string
                    title?: string
                    description?: string | null
                    position?: number
                    status?: string | null
                    estimated_weeks?: number | null
                    ai_insight?: string | null
                    content?: string | null // Added content column
                    created_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    node_id: string
                    title: string
                    description: string | null
                    priority: string | null
                    completed: boolean | null
                    estimated_hours: number | null
                    completed_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    node_id: string
                    title: string
                    description?: string | null
                    priority?: string | null
                    completed?: boolean | null
                    estimated_hours?: number | null
                    completed_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    node_id?: string
                    title?: string
                    description?: string | null
                    priority?: string | null
                    completed?: boolean | null
                    estimated_hours?: number | null
                    completed_at?: string | null
                    created_at?: string
                }
            }
            project_insights: {
                Row: {
                    id: string
                    project_id: string
                    type: string
                    content: string
                    action_label: string | null
                    action_url: string | null
                    is_read: boolean | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    project_id: string
                    type: string
                    content: string
                    action_label?: string | null
                    action_url?: string | null
                    is_read?: boolean | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string
                    type?: string
                    content?: string
                    action_label?: string | null
                    action_url?: string | null
                    is_read?: boolean | null
                    created_at?: string
                }
            }
            chat_sessions: {
                Row: {
                    id: string
                    user_id: string
                    title: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id: string
                    title?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            chat_messages: {
                Row: {
                    id: string
                    session_id: string
                    role: string
                    content: string
                    tool_calls: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    session_id: string
                    role: string
                    content: string
                    tool_calls?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    session_id?: string
                    role?: string
                    content?: string
                    tool_calls?: Json | null
                    created_at?: string
                }
            }
        }
    }
}

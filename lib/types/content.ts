import { Database } from '@/lib/types/database';

export type NodeDataWithContent = Database['public']['Tables']['canvas_nodes']['Row'] & {
    // Add any joined data types if needed
}

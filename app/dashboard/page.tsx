import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './dashboard-client';
import { Database } from '@/lib/types/database';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { getUserStats } from '@/app/actions/analytics';
import { getUserBadges } from '@/app/actions/badges';
import { loadChat } from '@/app/actions/chat';

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> // Next.js 15+ async searchParams
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Handle async searchParams
    const params = await searchParams;
    let projectId = typeof params.project === 'string' ? params.project : undefined;

    let project: Database['public']['Tables']['projects']['Row'] | null = null;

    // 1. If project ID is in URL, try to fetch it
    if (projectId) {
        const { data } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .eq('user_id', user.id) // Security check
            .single();

        project = data;
    }

    // 2. If no valid project yet, fetch the most recent one
    if (!project) {
        const { data } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        project = data;
    }

    // 3. If STILL no project, show "Empty State" / "Start New"
    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background noise-texture p-6 relative overflow-hidden">
                {/* Technical background elements */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

                <div className="max-w-md text-center space-y-10 relative z-10 w-full px-4">
                    <div className="w-16 h-16 mx-auto relative group">
                        <div className="relative h-full w-full bg-background border-2 border-saffron flex items-center justify-center">
                            <div className="w-4 h-4 bg-saffron" />
                        </div>
                        <div className="absolute -top-2 -right-2 font-mono text-[8px] text-saffron animate-pulse uppercase tracking-tighter">Standby: V.1.0</div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">Map Offline</h1>
                        <p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto uppercase tracking-widest">
                            System contains zero active roadmap structures.
                        </p>
                    </div>

                    <Link href="/onboarding" className="block">
                        <Button variant="glow" size="xl" className="w-full rounded-none h-16 font-mono text-xs uppercase tracking-[0.3em]">
                            Initialize New Strategy
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // 4. Fetch Stats and Badges
    const stats = await getUserStats(project.id);
    const badges = await getUserBadges();

    // --- PHASE 9: LEVELING ---
    const { getUserLevel } = await import('@/app/actions/game/leveling');
    const userLevel = await getUserLevel();
    // -------------------------

    // 5. Fetch Nodes for the Project
    const { data: nodes } = await supabase
        .from('canvas_nodes')
        .select('*')
        .eq('project_id', project.id)
        .order('position', { ascending: true });

    // Layout constants
    const LAYOUT = {
        NODE_X: 250,
        NODE_START_Y: 50,
        NODE_SPACING: 200,
    } as const;

    // 5. Transform DB Nodes to React Flow Nodes
    const nodesList = nodes ?? [];
    const initialNodes = nodesList.map((node, index) => ({
        id: node.node_id,
        type: 'custom',
        position: {
            x: LAYOUT.NODE_X,
            y: LAYOUT.NODE_START_Y + (index * LAYOUT.NODE_SPACING)
        },
        data: {
            dbId: node.id,
            label: node.title,
            description: node.description ?? '',
            status: node.status ?? 'locked',
            progress: node.status === 'current' ? 10 : 0,
            ai_insight: node.ai_insight
        },
    }));

    // 6. Generate Edges (linear connections)
    const initialEdges = nodesList.slice(0, -1).map((node, index) => {
        const nextNode = nodesList[index + 1];
        return {
            id: `e-${node.node_id}-${nextNode.node_id}`,
            source: node.node_id,
            target: nextNode.node_id,
            animated: node.status === 'current' || nextNode.status === 'current',
            style: { stroke: '#cbd5e1', strokeWidth: 2 },
        };
    });

    // 7. Fetch Project Insights
    const { data: insights } = await supabase
        .from('project_insights')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false })
        .limit(10); // Limit to recent 10 for performance in dropdown

    // 8. Fetch Chat History
    const chatHistory = await loadChat(project.id);

    return (
        <DashboardClient
            initialNodes={initialNodes}
            initialEdges={initialEdges}
            project={project}
            dbNodes={nodesList}
            user={user}
            stats={stats}
            badges={badges}
            userLevel={userLevel}
            insights={insights || []}
            chatHistory={chatHistory}
        />
    );
}

'use client';

import { useCallback, useState, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    type Node,
    type Edge,
    type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { Sparkles, Lock, CheckCircle2, PlayCircle, ChevronLeft, ChevronRight, Globe, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Database } from '@/lib/types/database';
// Mobile components removed
// Mobile hook removed
import mixpanel from '@/lib/analytics';
import { User } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';
import { TourProvider } from '@/components/providers/tour-provider';
import { UserStats } from '@/app/actions/analytics';
import { UserBadge } from '@/lib/types/gamification';
import { toast } from 'sonner';
import { LevelDisplay } from '@/components/dashboard/level-display';
import { Logo } from '@/components/ui/logo';
import { SettingsModal } from '@/components/dashboard/settings-modal';

// Lazy load non-critical dashboard components
const ProgressStats = dynamic(() => import('@/components/dashboard/progress-stats').then(mod => mod.ProgressStats), {
    loading: () => <div className="h-32 w-full bg-secondary/50 animate-pulse rounded-xl" />,
    ssr: false
})

const BadgeDisplay = dynamic(() => import('@/components/dashboard/badge-display').then(mod => mod.BadgeDisplay), {
    loading: () => <div className="h-24 w-full bg-secondary/50 animate-pulse rounded-xl" />,
    ssr: false
})

// Heavy Interactive Components (Lazy Load)
const NodeDetailSheet = dynamic(() => import('@/components/dashboard/node.sheet').then(mod => mod.NodeDetailSheet), {
    ssr: false // Interaction only
})

const SidebarChat = dynamic(() => import('@/components/dashboard/sidebar-chat').then(mod => mod.SidebarChat), {
    loading: () => <div className="flex-1 bg-card/50 animate-pulse rounded-lg m-4" />,
    ssr: false
})

// Define the exact shape of our Node Data
type CanvasNodeData = {
    dbId: string; // UUID from DB
    label: string;
    description: string;
    status: 'locked' | 'current' | 'complete';
    progress?: number;
    ai_insight?: string;
};

// Custom Node Component with proper typing
// Custom Node Component with "Digital Architect" Styling
function CustomNode({ data }: NodeProps<Node<CanvasNodeData>>) {
    const { label, status, description, progress } = data;

    const getStatusIcon = () => {
        if (status === 'complete') return <CheckCircle2 className="w-5 h-5 text-accent" strokeWidth={1.5} />;
        if (status === 'locked') return <Lock className="w-4 h-4 text-muted-foreground/50" strokeWidth={1.5} />;
        return null; // Active nodes don't need icon, they use the top border
    };

    const getNodeStyles = () => {
        const base = "px-5 py-4 min-w-[240px] bg-card border border-border transition-all hover:shadow-md";

        if (status === 'complete') {
            return `${base} opacity-70 bg-secondary/10 border-dashed`; // Completed: Architectural 'done' state
        }
        if (status === 'locked') {
            return `${base} opacity-50 grayscale bg-muted/20 border-dotted`; // Locked: Faded blueprint
        }
        // Current: Sharp, Active, Saffron Top Border
        return `${base} shadow-sm border-t-4 border-t-saffron`;
    };

    return (
        <div className={getNodeStyles()}>
            <div className="flex items-center justify-between mb-3">
                {/* Monospace Status Label - The 'Meta' Data */}
                <span className="text-[10px] font-mono tracking-wider uppercase text-muted-foreground">
                    {status === 'current' ? '• Active' : status}
                </span>
                {getStatusIcon()}
            </div>

            <h3 className="font-bold text-base text-foreground mb-1 tracking-tight">{label}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">{description}</p>

            {status === 'current' && (
                <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[10px] uppercase font-mono text-muted-foreground">
                        <span>Progress</span>
                        <span>{Math.round(progress || 0)}%</span>
                    </div>
                    <div className="h-1 bg-secondary rounded-none overflow-hidden">
                        <div className="h-full bg-saffron transition-all duration-500" style={{ width: `${progress || 0}%` }} />
                    </div>
                </div>
            )}
        </div>
    );
}

const nodeTypes = {
    custom: CustomNode,
};

// Props for the Client Component
interface DashboardClientProps {
    initialNodes: Node<CanvasNodeData>[];
    initialEdges: Edge[];
    project: Database['public']['Tables']['projects']['Row'];
    dbNodes: Database['public']['Tables']['canvas_nodes']['Row'][]; // Pass raw DB nodes for the sheet
    user: User;
    stats: UserStats;
    badges: UserBadge[]; // Added badges
    userLevel: {
        level: number;
        progress: number;
        totalTasks: number;
        nextLevelAt: number;
    };
    insights: Database['public']['Tables']['project_insights']['Row'][];
    chatHistory: import('ai').UIMessage[];
}

import { useRouter } from 'next/navigation';
import { InsightsFeed } from '@/components/dashboard/insights-feed';

export default function DashboardClient({
    initialNodes,
    initialEdges,
    project,
    dbNodes,
    user,
    badges,
    stats,
    userLevel,
    insights,
    chatHistory,
}: DashboardClientProps) {
    const router = useRouter();

    // Analytics Identification
    useEffect(() => {
        if (user) {
            mixpanel.identify(user.id);
            mixpanel.people.set({
                $email: user.email,
                $name: user.email, // Using email as name for now until we have profile names
            });
            mixpanel.track('Page View', { page_title: 'Dashboard' });
        }
    }, [user]);

    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    const [selectedNode, setSelectedNode] = useState<Database['public']['Tables']['canvas_nodes']['Row'] | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Sidebar States
    const [showLeftSidebar, setShowLeftSidebar] = useState(true);
    const [showRightSidebar, setShowRightSidebar] = useState(true);

    // Mobile logic removed
    const isMobile = false;

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        const data = node.data as CanvasNodeData;
        // Find full DB record using the UUID we embedded
        const fullNode = dbNodes.find(n => n.id === data.dbId);

        if (fullNode) {
            setSelectedNode(fullNode);
            if (isMobile) {
                setIsMobileModalOpen(true);
            } else {
                setIsSheetOpen(true);
            }
        }
    }, [dbNodes, isMobile]);

    // Handle mobile list node click
    const onMobileNodeClick = useCallback((node: { id: string; dbId: string; label: string; description: string; status: 'locked' | 'current' | 'complete'; progress?: number }) => {
        const fullNode = dbNodes.find(n => n.id === node.dbId);
        if (fullNode) {
            setSelectedNode(fullNode);
            setIsMobileModalOpen(true);
        }
    }, [dbNodes]);

    // Transform nodes for mobile list
    const mobileNodes = nodes.map(node => ({
        id: node.id,
        dbId: (node.data as CanvasNodeData).dbId,
        label: (node.data as CanvasNodeData).label,
        description: (node.data as CanvasNodeData).description,
        status: (node.data as CanvasNodeData).status,
        progress: (node.data as CanvasNodeData).progress,
    }));

    // Callback when AI modifies the roadmap
    const handleNodeAdded = useCallback(() => {
        router.refresh(); // Fetch fresh data from server
    }, [router]);

    // Lifted state for Global Chat
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <TourProvider>
            <div className="h-screen flex flex-col bg-background">
                {/* Global AI Chat removed from here - it is in RootLayout */}

                {/* Top Navigation */}
                <nav className="glass border-b border-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Logo className="w-8 h-8" />
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-foreground leading-none">
                                    Piely
                                </span>
                                <span className="text-xs text-muted-foreground font-medium">
                                    {project.title}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Dynamic Insights Feed */}
                            <InsightsFeed insights={insights} />

                            {/* User Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:ring-2 hover:ring-offset-2 hover:ring-accent transition-all overflow-hidden"
                                >
                                    {user.user_metadata?.avatar_url ? (
                                        <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs font-bold text-accent-foreground">
                                            {user.email?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg shadow-black/10 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                        <div className="px-3 py-2 border-b border-border/50 mb-1">
                                            <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                                            <p className="text-[10px] text-muted-foreground">Founder</p>
                                        </div>
                                        <button
                                            onClick={() => router.push('/dashboard/minds')}
                                            className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent/10 transition-colors flex items-center gap-2"
                                        >
                                            <Globe className="w-4 h-4" /> Community
                                        </button>
                                        <button
                                            onClick={() => {
                                                setUserMenuOpen(false)
                                                setIsSettingsOpen(true)
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent/10 transition-colors flex items-center gap-2"
                                        >
                                            <Settings className="w-4 h-4" /> Settings
                                        </button>
                                        <button
                                            onClick={async () => {
                                                const { createClient } = await import('@/lib/supabase/client')
                                                const supabase = createClient()
                                                await supabase.auth.signOut()
                                                router.push('/priority') // Redirect to login
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Settings Modal */}
                <SettingsModal
                    isOpen={isSettingsOpen}
                    onOpenChange={setIsSettingsOpen}
                    user={user}
                />

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Sidebar - AI Chat (Moved to Left) */}
                    <div
                        className={cn(
                            "border-r border-border bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out relative flex flex-col z-20",
                            isMobile ? "hidden" : showLeftSidebar ? "w-[350px]" : "w-0 opacity-0 overflow-hidden"
                        )}
                    >
                        {/* Toggle Button (Visible when open) */}
                        <div className={cn("absolute -right-3 top-6 z-50", !showLeftSidebar && "hidden")}>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 rounded-full border shadow-sm bg-background hover:bg-accent"
                                onClick={() => setShowLeftSidebar(false)}
                            >
                                <ChevronLeft className="h-3 w-3" />
                            </Button>
                        </div>

                        {/* Content Container */}
                        <div className="flex flex-col h-full overflow-hidden w-[350px]">
                            {/* Chat Header Removed as per user request */}

                            {/* Chat Body */}
                            <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                                <SidebarChat
                                    projectId={project.id}
                                    initialMessages={chatHistory}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Show Left Sidebar Button (When Closed) */}
                    {!showLeftSidebar && !isMobile && (
                        <div className="absolute left-4 top-24 z-30">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border shadow-md bg-background hover:bg-accent"
                                onClick={() => setShowLeftSidebar(true)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* Center - Canvas Area (Always Visible) */}
                    <div className="flex-1 relative block" data-tour="canvas">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            nodeTypes={nodeTypes}
                            onNodeClick={onNodeClick}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            fitView
                            className="bg-background/50"
                            defaultEdgeOptions={{
                                type: 'smoothstep',
                                animated: true,
                                style: { stroke: 'var(--border)', strokeWidth: 1.5, strokeDasharray: '4 4' },
                            }}
                        >
                            <Background color="#e4e4e7" gap={24} size={1} />
                            <Controls className="!bg-card !border !border-border !shadow-none !rounded-none" />
                        </ReactFlow>
                    </div>

                    {/* Right Sidebar - Navigation & Stats (Moved to Right) */}
                    <div
                        className={cn(
                            "border-l border-border bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out relative flex flex-col z-20",
                            isMobile ? "hidden" : showRightSidebar ? "w-[300px]" : "w-0 opacity-0 overflow-hidden"
                        )}
                    >
                        {/* Toggle Button (Visible when open) */}
                        <div className={cn("absolute -left-3 top-6 z-50", !showRightSidebar && "hidden")}>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 rounded-full border shadow-sm bg-background hover:bg-accent"
                                onClick={() => setShowRightSidebar(false)}
                            >
                                <ChevronRight className="h-3 w-3" />
                            </Button>
                        </div>

                        {/* Content Container */}
                        <div className="flex flex-col h-full overflow-hidden w-[300px]">
                            <div className="p-4 flex flex-col gap-6 h-full overflow-y-auto">
                                {/* Navigation */}
                                <div className="flex flex-col gap-1 shrink-0">
                                    <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 px-2">Navigation</h3>
                                    <button
                                        onClick={() => router.push('/dashboard/minds')}
                                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/5 rounded-lg transition-colors text-left group"
                                    >
                                        <Globe className="w-4 h-4 group-hover:scale-110 transition-transform text-muted-foreground group-hover:text-foreground" />
                                        <span>Minds Feed</span>
                                    </button>
                                </div>

                                {/* Gamification & Stats */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 px-2">Progress</h3>
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                                        <LevelDisplay
                                            level={userLevel.level}
                                            progress={userLevel.progress}
                                            totalTasks={userLevel.totalTasks}
                                            nextLevelAt={userLevel.nextLevelAt}
                                        />
                                    </motion.div>

                                    <ProgressStats stats={stats} />
                                    <BadgeDisplay badges={badges} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Show Right Sidebar Button (When Closed) */}
                    {!showRightSidebar && !isMobile && (
                        <div className="absolute right-4 top-24 z-30">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border shadow-md bg-background hover:bg-accent"
                                onClick={() => setShowRightSidebar(true)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* Mobile Roadmap List Removed */}
                </div>

                {/* Desktop Node Details Sheet */}
                <NodeDetailSheet
                    isOpen={isSheetOpen}
                    onClose={() => setIsSheetOpen(false)}
                    node={selectedNode}
                />

                {/* Mobile Detail Modal */}
                {/* Mobile Detail Modal Removed */}

                {/* Quick Actions Removed */}
            </div>
        </TourProvider >
    );
}

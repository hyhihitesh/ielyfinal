export type UserProfile = {
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    projectType: 'saas' | 'hardware' | 'mobile_app' | 'consumer_web' | 'other';
    technicalBackground: 'non_technical' | 'basic' | 'proficient';
    keyRisks: string[];
};

export type CanvasNode = {
    id: string; // "step_1" etc
    title: string;
    description: string;
    phase: 'validate' | 'build' | 'launch' | 'grow';
    estimatedWeeks: number;
    tasks: string[];
};

export type Roadmap = {
    analysis: {
        marketSummary: string;
    };
    nodes: CanvasNode[];
    edges: { source: string; target: string }[];
};

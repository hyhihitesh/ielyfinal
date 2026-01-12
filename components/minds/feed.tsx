'use client'

import { MindsPost, PostCard } from './post-card'

export function MindsFeed({ posts }: { posts: MindsPost[] }) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No updates yet. Be the first to share a win!</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}

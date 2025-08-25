'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, PlusCircle, ThumbsUp, ThumbsDown, Eye, Pin } from 'lucide-react';
import { SAMPLE_FORUM_POSTS } from '@/lib/data/extended-data';
import { ForumPost } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ForumPostView } from './ForumPostView';
import { useAppStore } from '@/lib/store';

type SortOption = 'newest' | 'oldest' | 'most-upvoted' | 'pinned';

interface ForumPostWithStats extends ForumPost {
    upvotes: number;
    downvotes: number;
    replyCount: number;
    views: number;
    userVoted?: 'up' | 'down' | null;
}

export function DiscussionForums() {
    const [posts, setPosts] = useState<ForumPostWithStats[]>(
        SAMPLE_FORUM_POSTS.map(post => ({
            ...post,
            upvotes: Math.floor(Math.random() * 50) + 1,
            downvotes: Math.floor(Math.random() * 10),
            replyCount: Math.floor(Math.random() * 15) + 1,
            views: Math.floor(Math.random() * 200) + 10,
            userVoted: null
        }))
    );
    const [selectedPost, setSelectedPost] = useState<ForumPostWithStats | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [filterBy, setFilterBy] = useState<string>('all');
    const [view, setView] = useState<'list' | 'create'>('list');
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostTopic, setNewPostTopic] = useState('');
    const { createForumPost } = useAppStore();

    // Sort and filter posts
    const getSortedAndFilteredPosts = () => {
        let filtered = posts;

        // Filter by topic
        if (filterBy !== 'all') {
            filtered = filtered.filter(post => post.topicId === filterBy);
        }

        // Sort posts
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'most-upvoted':
                    return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
                case 'pinned':
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'newest':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        return sorted;
    };

    const handleVote = (postId: string, voteType: 'up' | 'down') => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === postId) {
                    const newPost = { ...post };
                    if (voteType === 'up') {
                        if (newPost.userVoted === 'up') {
                            newPost.upvotes--;
                            newPost.userVoted = null;
                        } else {
                            if (newPost.userVoted === 'down') newPost.downvotes--;
                            newPost.upvotes++;
                            newPost.userVoted = 'up';
                        }
                    } else {
                        if (newPost.userVoted === 'down') {
                            newPost.downvotes--;
                            newPost.userVoted = null;
                        } else {
                            if (newPost.userVoted === 'up') newPost.upvotes--;
                            newPost.downvotes++;
                            newPost.userVoted = 'down';
                        }
                    }
                    return newPost;
                }
                return post;
            })
        );
    };

    const handleCreatePost = () => {
        if (!newPostTitle || !newPostContent || !newPostTopic) return;

        const postData = {
            authorId: 'user_current_001',
            topicId: newPostTopic,
            title: newPostTitle,
            content: newPostContent
        };

        createForumPost(postData);

        // Add to local state
        const newPost: ForumPostWithStats = {
            ...postData,
            id: `post_${Date.now()}`,
            createdAt: new Date().toISOString(),
            isPinned: false,
            isLocked: false,
            upvotes: 1,
            downvotes: 0,
            replyCount: 0,
            views: 1,
            userVoted: 'up'
        };

        setPosts(prev => [newPost, ...prev]);
        alert("Your post has been created successfully!");
        setNewPostTitle('');
        setNewPostContent('');
        setNewPostTopic('');
        setView('list');
    };

    if (selectedPost) {
        return <ForumPostView post={selectedPost} onBack={() => setSelectedPost(null)} />;
    }

    if (view === 'create') {
        return (
            <div>
                <Button variant="outline" onClick={() => setView('list')} className="mb-4">
                    ← Back to Forums
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Discussion</CardTitle>
                        <CardDescription>Start a new discussion to get help or share knowledge.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Topic</label>
                            <Select value={newPostTopic} onValueChange={setNewPostTopic}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a topic" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="polity_preamble">Polity - Preamble</SelectItem>
                                    <SelectItem value="polity_fr">Polity - Fundamental Rights</SelectItem>
                                    <SelectItem value="geog_monsoon">Geography - Monsoon</SelectItem>
                                    <SelectItem value="econ_fiscal">Economics - Fiscal Policy</SelectItem>
                                    <SelectItem value="history_ivc">History - Indus Valley</SelectItem>
                                    <SelectItem value="sci_space">Science - Space</SelectItem>
                                    <SelectItem value="env_bio">Environment - Biodiversity</SelectItem>
                                    <SelectItem value="ethics_integrity">Ethics - Integrity</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                placeholder="What's your question or topic?"
                                value={newPostTitle}
                                onChange={(e) => setNewPostTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                className="w-full h-32 p-3 border border-dark-blue/20 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-dark-blue bg-ice-white text-sm"
                                placeholder="Provide more details about your question or share your thoughts..."
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            />
                        </div>
                        <Button
                            className="w-full"
                            onClick={handleCreatePost}
                            disabled={!newPostTitle || !newPostContent || !newPostTopic}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" /> Create Discussion
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const sortedPosts = getSortedAndFilteredPosts();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Discussion Forums</CardTitle>
                    <CardDescription>Ask questions, share knowledge, and learn from the community.</CardDescription>
                </div>
                <Button onClick={() => setView('create')}>
                    <PlusCircle className="h-4 w-4 mr-2" /> New Post
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Filters and Sort */}
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">Sort by:</label>
                        <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="most-upvoted">Most Upvoted</SelectItem>
                                <SelectItem value="pinned">Pinned First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">Filter by:</label>
                        <Select value={filterBy} onValueChange={setFilterBy}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Topics</SelectItem>
                                <SelectItem value="polity_preamble">Polity - Preamble</SelectItem>
                                <SelectItem value="polity_fr">Polity - Fundamental Rights</SelectItem>
                                <SelectItem value="geog_monsoon">Geography - Monsoon</SelectItem>
                                <SelectItem value="econ_fiscal">Economics - Fiscal Policy</SelectItem>
                                <SelectItem value="history_ivc">History - Indus Valley</SelectItem>
                                <SelectItem value="sci_space">Science - Space</SelectItem>
                                <SelectItem value="env_bio">Environment - Biodiversity</SelectItem>
                                <SelectItem value="ethics_integrity">Ethics - Integrity</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Posts List */}
                {sortedPosts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 cursor-pointer" onClick={() => setSelectedPost(post)}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            {post.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                                            <h3 className="font-semibold">{post.title}</h3>
                                        </div>
                                        <p className="text-sm text-void-black/80 mb-2 line-clamp-2">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs text-void-black/60">
                                            <span>by User {post.authorId.slice(-3)}</span>
                                            <span>•</span>
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <div className="flex items-center space-x-1">
                                                <Eye className="h-3 w-3" />
                                                <span>{post.views} views</span>
                                            </div>
                                            <span>•</span>
                                            <span>{post.replyCount} replies</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center space-y-1 ml-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleVote(post.id, 'up')}
                                            className={`p-1 ${post.userVoted === 'up' ? 'text-green-500' : 'text-gray-400'}`}
                                        >
                                            <ThumbsUp className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm font-medium">
                                            {post.upvotes - post.downvotes}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleVote(post.id, 'down')}
                                            className={`p-1 ${post.userVoted === 'down' ? 'text-red-500' : 'text-gray-400'}`}
                                        >
                                            <ThumbsDown className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-xs bg-electric-aqua/20 text-electric-aqua px-2 py-1 rounded">
                                        {post.topicId.replace('_', ' ').toUpperCase()}
                                    </span>
                                    <Button variant="outline" size="sm" onClick={() => setSelectedPost(post)}>
                                        View Discussion
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}

                {sortedPosts.length === 0 && (
                    <div className="text-center py-8 text-void-black/50">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No discussions found for the selected filters.</p>
                        <Button variant="outline" className="mt-4" onClick={() => setView('create')}>
                            Start the first discussion
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

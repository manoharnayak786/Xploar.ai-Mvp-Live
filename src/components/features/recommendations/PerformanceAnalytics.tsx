'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, TrendingUp, Target, BookOpen, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';

interface PerformanceData {
    id: string;
    activity_type: string;
    topic_id?: string;
    genre?: string;
    score?: number;
    time_spent_minutes?: number;
    created_at: string;
}

interface AnalyticsSummary {
    totalSessions: number;
    averageScore: number;
    totalTimeSpent: number;
    improvementRate: number;
    strengths: string[];
    weaknesses: string[];
    recentActivity: PerformanceData[];
}

interface EvaluationData {
    id: string;
    accuracy_score: number;
    submitted_at: string;
}

export function PerformanceAnalytics() {
    const { fetchPerformanceAnalytics, fetchAIEvaluations } = useAppStore();
    const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                setLoading(true);
                const [performanceData, evaluations] = await Promise.all([
                    fetchPerformanceAnalytics(),
                    fetchAIEvaluations()
                ]);

                // Process data to create analytics summary
                const summary = processAnalyticsData(performanceData, evaluations);
                setAnalytics(summary);
            } catch (error) {
                console.error('Failed to load analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, [fetchPerformanceAnalytics, fetchAIEvaluations]);

    const processAnalyticsData = (performance: PerformanceData[], evaluations: EvaluationData[]): AnalyticsSummary => {
        const totalSessions = performance.length;
        const scores = performance.filter(p => p.score).map(p => p.score!);
        const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        const totalTimeSpent = performance.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0);

        // Calculate improvement rate (simplified)
        const improvementRate = Math.min(15, totalSessions * 0.5); // Mock improvement rate

        // Identify strengths and weaknesses based on scores
        const strengths: string[] = [];
        const weaknesses: string[] = [];

        // Analyze by activity type
        const essayEvaluations = evaluations.filter((e) => e.accuracy_score > 80);
        const mockTests = performance.filter(p => p.activity_type === 'mock_test' && p.score && p.score > 70);

        if (essayEvaluations.length > 0) {
            strengths.push('Essay Writing');
        }
        if (mockTests.length > 0) {
            strengths.push('Mock Test Performance');
        }

        // Mock weaknesses based on low scores
        if (averageScore < 60) {
            weaknesses.push('Overall Performance Needs Improvement');
        }
        if (evaluations.some((e) => e.accuracy_score < 60)) {
            weaknesses.push('Essay Accuracy');
        }

        // Get recent activity
        const recentActivity = performance
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);

        return {
            totalSessions,
            averageScore,
            totalTimeSpent,
            improvementRate,
            strengths,
            weaknesses,
            recentActivity
        };
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-aqua mx-auto mb-2"></div>
                    <p className="text-sm text-void-black/70">Loading performance analytics...</p>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="space-y-6">
                <div className="text-center py-8 text-void-black/50">
                    <BarChart className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No performance data available yet.</p>
                    <p className="text-xs">Complete some mock tests and essay evaluations to see your analytics.</p>
                </div>
            </div>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-green-50 border-green-200';
        if (score >= 60) return 'bg-yellow-50 border-yellow-200';
        return 'bg-red-50 border-red-200';
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h2 className="text-2xl font-bold text-void-black mb-2">Performance Analytics</h2>
                <p className="text-void-black/70">Track your progress and identify areas for improvement</p>
            </motion.div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className={getScoreBg(analytics.averageScore)}>
                    <CardContent className="p-4 text-center">
                        <Target className="h-6 w-6 mx-auto text-electric-aqua mb-2" />
                        <p className={`text-2xl font-bold ${getScoreColor(analytics.averageScore)}`}>
                            {analytics.averageScore.toFixed(1)}%
                        </p>
                        <p className="text-sm text-void-black/70">Average Score</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <BookOpen className="h-6 w-6 mx-auto text-electric-aqua mb-2" />
                        <p className="text-2xl font-bold text-electric-aqua">{analytics.totalSessions}</p>
                        <p className="text-sm text-void-black/70">Total Sessions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <Clock className="h-6 w-6 mx-auto text-electric-aqua mb-2" />
                        <p className="text-2xl font-bold text-electric-aqua">{analytics.totalTimeSpent}</p>
                        <p className="text-sm text-void-black/70">Minutes Studied</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <TrendingUp className="h-6 w-6 mx-auto text-green-500 mb-2" />
                        <p className="text-2xl font-bold text-green-600">+{analytics.improvementRate.toFixed(1)}%</p>
                        <p className="text-sm text-void-black/70">Improvement Rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Award className="h-5 w-5 mr-2 text-green-500" />
                            Your Strengths
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {analytics.strengths.length > 0 ? (
                            <ul className="space-y-2">
                                {analytics.strengths.map((strength, index) => (
                                    <li key={index} className="flex items-center text-sm">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        {strength}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-void-black/50">Complete more assessments to identify strengths.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Target className="h-5 w-5 mr-2 text-yellow-500" />
                            Areas for Improvement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {analytics.weaknesses.length > 0 ? (
                            <ul className="space-y-2">
                                {analytics.weaknesses.map((weakness, index) => (
                                    <li key={index} className="flex items-center text-sm">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                                        {weakness}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-void-black/50">Great job! No major weaknesses identified.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest study sessions and assessments</CardDescription>
                </CardHeader>
                <CardContent>
                    {analytics.recentActivity.length > 0 ? (
                        <div className="space-y-3">
                            {analytics.recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-electric-aqua/10 rounded-full flex items-center justify-center">
                                            <BookOpen className="h-4 w-4 text-electric-aqua" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium capitalize">
                                                {activity.activity_type.replace('_', ' ')}
                                            </p>
                                            <p className="text-xs text-void-black/60">
                                                {activity.topic_id || activity.genre || 'General Practice'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {activity.score && (
                                            <p className={`text-sm font-medium ${getScoreColor(activity.score)}`}>
                                                {activity.score.toFixed(1)}%
                                            </p>
                                        )}
                                        <p className="text-xs text-void-black/60">
                                            {new Date(activity.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-void-black/50 text-center py-4">
                            No recent activity. Start taking mock tests and practicing essays to see your progress here.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, BarChart, Clock, BookOpen, Lightbulb, RotateCcw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EssayGenre } from './AIEvaluation';
import { aiService } from '@/lib/services/aiService';

interface ResultsScreenProps {
    genre: EssayGenre;
    question: string;
    essay: string;
    onRestart: () => void;
    onSaveEvaluation?: (evaluation: {
        accuracy: number;
        coverage: number;
        timeEfficiency: number;
        recommendations: string[];
        feedback: string;
        wordCount: number;
    }) => Promise<void>;
}

interface EvaluationResult {
    accuracy: number;
    coverage: number;
    timeEfficiency: number;
    recommendations: string[];
    feedback: string;
    wordCount: number;
}

export function ResultsScreen({ genre, question, essay, onRestart, onSaveEvaluation }: ResultsScreenProps) {
    const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const evaluateEssay = async () => {
            try {
                setLoading(true);
                setError(null);

                // Evaluate the essay using AI service
                const result = await aiService.evaluateEssay(essay, {
                    genre,
                    question,
                    wordCount: essay.trim().split(/\s+/).length,
                    timeSpent: 15 // Assume 15 minutes for now
                });

                setEvaluation(result);

                // Save evaluation to database if callback provided
                if (onSaveEvaluation) {
                    try {
                        await onSaveEvaluation(result);
                    } catch (saveErr) {
                        console.error('Failed to save evaluation:', saveErr);
                        // Don't show error to user as evaluation was successful
                    }
                }
            } catch (err) {
                console.error('Evaluation error:', err);
                setError('Failed to evaluate essay. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (essay.trim()) {
            evaluateEssay();
        }
    }, [essay, genre, question, onSaveEvaluation]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <Loader2 className="h-16 w-16 text-electric-aqua mx-auto mb-4 animate-spin" />
                    <h1 className="text-3xl font-bold text-void-black mb-2">Evaluating Your Essay</h1>
                    <p className="text-void-black/70">AI Coach is analyzing your response...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-500 text-2xl">⚠️</span>
                    </div>
                    <h1 className="text-3xl font-bold text-void-black mb-2">Evaluation Error</h1>
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button size="lg" onClick={onRestart}>
                        <RotateCcw className="h-4 w-4 mr-2" /> Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!evaluation) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-void-black mb-2">No Essay to Evaluate</h1>
                    <p className="text-void-black/70">Please submit an essay for evaluation.</p>
                    <Button size="lg" className="mt-4" onClick={onRestart}>
                        <RotateCcw className="h-4 w-4 mr-2" /> Start Over
                    </Button>
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
        if (score >= 80) return 'bg-green-50';
        if (score >= 60) return 'bg-yellow-50';
        return 'bg-red-50';
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-void-black mb-2">Evaluation Complete</h1>
                <p className="text-void-black/70">Here is the AI Coach's comprehensive feedback on your essay.</p>
            </div>

            {/* Overall Feedback */}
            <Card className="bg-gradient-to-r from-electric-aqua/5 to-dark-blue/5 border-electric-aqua/20">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-electric-aqua" />
                        AI Coach Feedback
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-void-black/80 leading-relaxed">{evaluation.feedback}</p>
                </CardContent>
            </Card>

            {/* Metric Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card className={`${getScoreBg(evaluation.accuracy)} border-2`}>
                    <CardContent className="p-4 text-center">
                        <BarChart className="h-6 w-6 mx-auto text-electric-aqua mb-2" />
                        <p className={`text-3xl font-bold ${getScoreColor(evaluation.accuracy)}`}>
                            {evaluation.accuracy}%
                        </p>
                        <p className="text-sm text-void-black/70">Accuracy & Relevance</p>
                        <p className="text-xs text-void-black/60 mt-1">
                            Content quality and topic understanding
                        </p>
                    </CardContent>
                </Card>
                <Card className={`${getScoreBg(evaluation.coverage)} border-2`}>
                    <CardContent className="p-4 text-center">
                        <BookOpen className="h-6 w-6 mx-auto text-electric-aqua mb-2" />
                        <p className={`text-3xl font-bold ${getScoreColor(evaluation.coverage)}`}>
                            {evaluation.coverage}%
                        </p>
                        <p className="text-sm text-void-black/70">Syllabus Coverage</p>
                        <p className="text-xs text-void-black/60 mt-1">
                            Question components addressed
                        </p>
                    </CardContent>
                </Card>
                <Card className={`${getScoreBg(evaluation.timeEfficiency)} border-2`}>
                    <CardContent className="p-4 text-center">
                        <Clock className="h-6 w-6 mx-auto text-electric-aqua mb-2" />
                        <p className={`text-3xl font-bold ${getScoreColor(evaluation.timeEfficiency)}`}>
                            {evaluation.timeEfficiency}%
                        </p>
                        <p className="text-sm text-void-black/70">Time Efficiency</p>
                        <p className="text-xs text-void-black/60 mt-1">
                            Writing speed and time management
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Essay Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle>Essay Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-electric-aqua">{evaluation.wordCount}</p>
                            <p className="text-sm text-void-black/70">Words</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-electric-aqua">
                                {Math.round(evaluation.wordCount / 15)}
                            </p>
                            <p className="text-sm text-void-black/70">Words/Min</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-electric-aqua">
                                {Math.round(evaluation.wordCount / 250)}
                            </p>
                            <p className="text-sm text-void-black/70">Pages</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-electric-aqua">15:00</p>
                            <p className="text-sm text-void-black/70">Time Taken</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Recommendations */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                        Actionable Recommendations
                    </CardTitle>
                    <CardDescription>
                        Specific steps to improve your essay writing skills
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {evaluation.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0 w-6 h-6 bg-electric-aqua/10 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-electric-aqua">{index + 1}</span>
                                </div>
                                <p className="text-sm text-void-black/80">{rec}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Your Submission */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Submission</CardTitle>
                    <CardDescription className="text-base font-medium">{question}</CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-void-black/60 mt-2">
                        <span>Genre: <strong>{genre}</strong></span>
                        <span>Word Count: <strong>{evaluation.wordCount}</strong></span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-gray-50 rounded-md border">
                        <p className="text-sm whitespace-pre-wrap text-void-black/90 leading-relaxed">
                            {essay || "(No answer was submitted.)"}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center">
                <Button size="lg" onClick={onRestart} className="bg-electric-aqua hover:bg-electric-aqua/90">
                    <RotateCcw className="h-4 w-4 mr-2" /> Practice Another Essay
                </Button>
            </div>
        </div>
    );
}

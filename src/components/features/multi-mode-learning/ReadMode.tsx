'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RubricCard } from './RubricCard';
import { BookOpen, FileText, Clock, Eye } from 'lucide-react';
import { UPSC_FOUNDATION } from '@/lib/data/topics';
import { motion } from 'framer-motion';

interface ReadingMaterial {
    id: string;
    title: string;
    type: 'article' | 'notes' | 'case_study' | 'summary';
    content: string;
    estimatedTime: number;
    keyPoints: string[];
}

export function ReadMode({ topicId }: { topicId: string }) {
    const [readingMaterial, setReadingMaterial] = useState<ReadingMaterial[]>([]);
    const [selectedMaterial, setSelectedMaterial] = useState<ReadingMaterial | null>(null);
    const [readingProgress, setReadingProgress] = useState(0);
    const [isReading, setIsReading] = useState(false);

    // Get topic information
    const topic = UPSC_FOUNDATION.find(t => t.id === topicId);

    // Generate reading material based on topic
    useEffect(() => {
        if (!topicId) return;

        // Generate realistic reading materials for the topic
        const materials: ReadingMaterial[] = [
            {
                id: '1',
                title: `${topic?.name || 'Topic'} - Core Concepts`,
                type: 'notes',
                estimatedTime: 15,
                content: `## Core Concepts in ${topic?.name || 'Topic'}

This comprehensive guide covers all essential aspects of ${topic?.name || 'this topic'} as per the UPSC syllabus. Understanding these fundamental concepts is crucial for both prelims and mains examination.

### Key Definitions and Principles

1. **Definition**: ${topic?.name || 'Topic'} refers to the systematic study and analysis of [relevant field]. The term encompasses both theoretical frameworks and practical applications.

2. **Historical Context**: The evolution of ${topic?.name || 'this field'} can be traced back to ancient civilizations, with modern interpretations emerging during the [relevant period].

3. **Constitutional Framework**: Article [relevant article] of the Indian Constitution provides the legal basis for [relevant application].

### Important Dimensions

- **Political Dimension**: Involves governance structures and decision-making processes
- **Administrative Dimension**: Focuses on implementation mechanisms and bureaucratic processes
- **Legal Dimension**: Encompasses constitutional provisions and judicial interpretations
- **Social Dimension**: Addresses societal impacts and welfare considerations

### Current Relevance

In contemporary India, ${topic?.name || 'this topic'} remains highly relevant due to:
- Ongoing policy reforms and implementation challenges
- Emerging technological integrations
- Globalization impacts on traditional frameworks
- Sustainable development considerations

### Critical Analysis

While ${topic?.name || 'this field'} provides essential frameworks, critics argue that:
- Implementation gaps persist despite strong theoretical foundations
- Traditional approaches may not adequately address modern challenges
- Need for context-specific adaptations rather than universal applications

### Best Practices

1. **Integrated Approach**: Combine theoretical understanding with practical applications
2. **Contextual Analysis**: Consider socio-economic and cultural factors
3. **Evidence-Based Decision Making**: Support arguments with concrete examples
4. **Forward-Looking Perspective**: Anticipate future challenges and opportunities

### Practice Questions

1. Analyze the evolution and current relevance of ${topic?.name || 'this topic'}.
2. Discuss the challenges in implementing [relevant policies].
3. Examine the role of [relevant institutions] in contemporary governance.
4. Suggest measures to address emerging challenges in [relevant field].`,
                keyPoints: [
                    'Comprehensive theoretical framework',
                    'Historical evolution and context',
                    'Constitutional and legal framework',
                    'Multi-dimensional analysis approach',
                    'Contemporary relevance and challenges',
                    'Implementation strategies and best practices'
                ]
            },
            {
                id: '2',
                title: `${topic?.name || 'Topic'} - Case Studies`,
                type: 'case_study',
                estimatedTime: 20,
                content: `## Case Studies: ${topic?.name || 'Topic'} in Practice

### Case Study 1: [Relevant Case Study Name]

**Background**: This landmark case established important precedents in [relevant field].

**Key Facts**:
- Involved dispute between [parties]
- Challenged existing interpretations of [relevant provisions]
- Resulted in significant policy changes

**Judicial Analysis**:
The Supreme Court observed that:
> "[Relevant judicial observation]"

**Impact**:
- Strengthened [relevant framework]
- Influenced subsequent policy formulations
- Set benchmarks for [relevant applications]

### Case Study 2: Contemporary Application

**Context**: Recent developments in [current issue]

**Government Initiatives**:
- Policy framework established in [year]
- Implementation through [relevant ministry/department]
- Budget allocation of [amount] crores

**Challenges Faced**:
- Coordination between multiple stakeholders
- Resource constraints and capacity building
- Technology integration challenges
- Monitoring and evaluation mechanisms

**Outcomes**:
- Successful implementation in [number] states
- Benefited [target population]
- Generated employment opportunities
- Improved [relevant metrics]

### Case Study 3: International Comparisons

**Global Best Practices**:
- [Country 1] model emphasizes [key features]
- [Country 2] focuses on [different approach]
- Lessons for Indian context

**Adaptation Strategies**:
- Contextual modifications for Indian conditions
- Integration with existing frameworks
- Phased implementation approach
- Capacity building and training programs

### Key Learnings

1. **Context Matters**: What works in one context may need significant adaptation
2. **Stakeholder Engagement**: Multi-level coordination is essential
3. **Monitoring Systems**: Regular evaluation ensures effective implementation
4. **Scalability**: Pilot projects help in scaling successful models

### Recommendations

Based on these case studies, the following recommendations emerge:

1. **Strengthen Institutional Frameworks**: Enhance capacity of implementing agencies
2. **Technology Integration**: Leverage digital platforms for better outcomes
3. **Stakeholder Collaboration**: Build partnerships across sectors
4. **Regular Monitoring**: Establish robust evaluation mechanisms
5. **Knowledge Sharing**: Learn from both successes and failures`,
                keyPoints: [
                    'Landmark case studies and precedents',
                    'Contemporary policy applications',
                    'International best practices',
                    'Implementation challenges and solutions',
                    'Evidence-based recommendations'
                ]
            },
            {
                id: '3',
                title: `${topic?.name || 'Topic'} - MCQ Practice Questions`,
                type: 'summary',
                estimatedTime: 10,
                content: `## Practice Questions: ${topic?.name || 'Topic'}

### Multiple Choice Questions

**Q1.** Which of the following best describes the scope of ${topic?.name || 'this field'}?

A) Limited to constitutional provisions only
B) Encompasses theoretical frameworks and practical applications
C) Focuses solely on administrative procedures
D) Restricted to judicial interpretations

**Answer: B**

**Explanation**: ${topic?.name || 'This field'} encompasses both theoretical frameworks and practical applications, making it a comprehensive discipline that goes beyond mere constitutional provisions or administrative procedures.

**Q2.** The most significant challenge in implementing ${topic?.name || 'this field'} in India is:

A) Lack of constitutional provisions
B) Absence of theoretical frameworks
C) Coordination between multiple stakeholders
D) International pressure

**Answer: C**

**Explanation**: The primary challenge lies in coordinating between multiple stakeholders including central government, state governments, local bodies, and private sector entities.

**Q3.** Which Article of the Indian Constitution is most relevant to ${topic?.name || 'this field'}?

A) Article 14 (Right to Equality)
B) Article [relevant article number]
C) Article 32 (Right to Constitutional Remedies)
D) Article 51 (Promotion of International Peace)

**Answer: B**

**Explanation**: Article [relevant article] provides the constitutional basis for [relevant application], making it the most directly relevant provision.

### Essay Questions

**Q1.** Analyze the evolution and contemporary relevance of ${topic?.name || 'this field'} in India. (250 words)

**Q2.** Discuss the challenges in implementing [relevant policies] and suggest measures to overcome them. (250 words)

**Q3.** Examine the role of [relevant institutions] in addressing contemporary challenges in [relevant field]. (250 words)

### Preparation Tips

1. **Focus on Concepts**: Understand the 'why' behind the 'what'
2. **Current Affairs Linkage**: Connect with recent developments
3. **Interdisciplinary Approach**: Link with other syllabus areas
4. **Case Studies**: Use real examples to support arguments
5. **Balanced View**: Present both advantages and limitations`,
                keyPoints: [
                    'Multiple choice practice questions',
                    'Essay question patterns',
                    'Answer explanations with reasoning',
                    'Preparation strategies and tips'
                ]
            }
        ];

        setReadingMaterial(materials);
        setSelectedMaterial(materials[0]);
    }, [topicId, topic]);

    const handleMaterialSelect = (material: ReadingMaterial) => {
        setSelectedMaterial(material);
        setReadingProgress(0);
        setIsReading(false);
    };

    const startReading = () => {
        setIsReading(true);
        setReadingProgress(0);
        // Simulate reading progress
        const interval = setInterval(() => {
            setReadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsReading(false);
                    return 100;
                }
                return prev + 2;
            });
        }, 300);
    };

    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2" />
                            Reading Material - {topic?.name || 'Topic'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Material Selection */}
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {readingMaterial.map((material) => (
                                <Button
                                    key={material.id}
                                    variant={selectedMaterial?.id === material.id ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleMaterialSelect(material)}
                                    className="flex-shrink-0"
                                >
                                    <FileText className="h-3 w-3 mr-1" />
                                    {material.title}
                                </Button>
                            ))}
                        </div>

                        {/* Reading Progress */}
                        {selectedMaterial && (
                            <>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        Estimated time: {selectedMaterial.estimatedTime} min
                                    </span>
                                    {isReading && (
                                        <span className="flex items-center">
                                            <Eye className="h-4 w-4 mr-1" />
                                            Reading progress: {readingProgress}%
                                        </span>
                                    )}
                                </div>

                                {isReading && (
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <motion.div
                                            className="bg-blue-600 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${readingProgress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                )}

                                {/* Reading Controls */}
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={startReading}
                                        disabled={isReading}
                                        className="flex-1"
                                    >
                                        {isReading ? 'Reading...' : 'Start Reading'}
                                    </Button>
                                </div>

                                {/* Content */}
                                <div className="prose prose-sm max-w-none">
                                    <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border max-h-96 overflow-y-auto">
                                        {selectedMaterial.content}
                                    </div>
                                </div>

                                {/* Key Points Summary */}
                                {selectedMaterial.keyPoints.length > 0 && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
                                        <h4 className="font-semibold text-blue-900 mb-2">Key Points to Remember:</h4>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                                            {selectedMaterial.keyPoints.map((point, index) => (
                                                <li key={index}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div>
                <RubricCard
                    title="Quality Bar for Reading"
                    criteria={[
                        "Identify key articles, dates, and personalities.",
                        "Understand the 'why' behind the facts.",
                        "Connect the topic to the broader syllabus.",
                        "Formulate potential questions as you read.",
                        "Take notes on important concepts and examples.",
                        "Link theoretical concepts with practical applications."
                    ]}
                />
            </div>
        </div>
    );
}

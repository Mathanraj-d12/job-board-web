import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { auth } from '../firebase';

const PersonalityQuiz = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {

        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '60vh',
                gap: 2
            }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Please sign in to view available jobs
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/signin')}
                >
                    Sign In
                </Button>
            </Box>
        );
    }
    
    const questions = [
        {
            question: "How do you approach problem-solving?",
            options: {
                A: "I analyze data and trends before making a decision.",
                B: "I brainstorm creative ideas to find innovative solutions.",
                C: "I rely on logic and structured methodologies.",
                D: "I consider user needs and business goals before deciding."
            }
        },
        {
            question: "In a team setting, which role do you prefer?",
            options: {
                A: "Analyzing information and providing insights.",
                B: "Coming up with new ideas and possibilities.",
                C: "Organizing tasks and creating structure.",
                D: "Managing relationships and facilitating communication."
            }
        },
        {
            question: "What environment helps you work best?",
            options: {
                A: "Quiet space where I can focus on data and details.",
                B: "Dynamic environment that stimulates creativity.",
                C: "Structured environment with clear processes.",
                D: "Collaborative space where I can interact with others."
            }
        },
        {
            question: "When learning something new, you prefer to:",
            options: {
                A: "Understand the theory and analyze the concepts.",
                B: "Experiment and discover new approaches.",
                C: "Follow step-by-step instructions.",
                D: "Learn through discussion and collaboration."
            }
        },
        {
            question: "What type of projects energize you the most?",
            options: {
                A: "Research-based projects requiring deep analysis.",
                B: "Creative projects with room for innovation.",
                C: "Technical projects with clear objectives.",
                D: "Projects involving people and improving user experiences."
            }
        },
        {
            question: "How do you handle deadlines and pressure?",
            options: {
                A: "I create detailed plans and track progress methodically.",
                B: "I thrive under pressure and adapt quickly to changes.",
                C: "I follow established processes to ensure timely completion.",
                D: "I collaborate with team members to distribute workload effectively."
            }
        },
        {
            question: "What's your preferred way of making decisions?",
            options: {
                A: "Analyzing data and considering all possible outcomes.",
                B: "Going with my intuition and creative instincts.",
                C: "Following established guidelines and best practices.",
                D: "Consulting with others and reaching consensus."
            }
        },
        {
            question: "How do you prefer to receive feedback?",
            options: {
                A: "Detailed written analysis with specific examples.",
                B: "Open-ended suggestions that spark new ideas.",
                C: "Clear, structured feedback with actionable steps.",
                D: "Face-to-face discussions with collaborative problem-solving."
            }
        },
        {
            question: "What aspect of work gives you the most satisfaction?",
            options: {
                A: "Solving complex problems and finding patterns.",
                B: "Creating innovative solutions and unique approaches.",
                C: "Implementing efficient systems and processes.",
                D: "Building relationships and helping others succeed."
            }
        },
        {
            question: "How do you approach learning new technologies?",
            options: {
                A: "Research thoroughly and analyze documentation.",
                B: "Experiment with features and explore possibilities.",
                C: "Follow tutorials and structured learning paths.",
                D: "Join communities and learn through collaboration."
            }
        }
    ];

    const handleAnswerChange = (questionIndex, option) => {
        setAnswers({
            ...answers,
            [questionIndex]: option
        });
    };

    const calculateResults = () => {
        if (Object.keys(answers).length < questions.length) {
            alert('Please answer all questions before submitting.');
            return;
        }

        // Count the frequency of each answer type
        const counts = { A: 0, B: 0, C: 0, D: 0 };
        
        Object.values(answers).forEach(answer => {
            counts[answer]++;
        });

        // Determine the dominant personality type
        let dominantType = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        
        // Map personality types to career recommendations based on available job categories
        const personalityTypes = {
            A: {
                type: 'Analytical Thinker',
                description: 'You excel at analyzing data and solving complex problems. You prefer working with facts and figures.',
                careers: ['Technology', 'Finance', 'Engineering']
            },
            B: {
                type: 'Creative Innovator',
                description: 'You thrive on creativity and innovation. You enjoy thinking outside the box and developing new ideas.',
                careers: ['Design', 'Marketing']
            },
            C: {
                type: 'Systematic Executor',
                description: 'You excel at implementing systems and processes. You are detail-oriented and methodical in your approach.',
                careers: ['Technology', 'Engineering']
            },
            D: {
                type: 'People-Focused Collaborator',
                description: 'You are skilled at understanding people and facilitating collaboration. You thrive in social environments.',
                careers: ['Sales', 'Customer Service', 'Human Resources']
            }
        };

        setResult(personalityTypes[dominantType]);
        setShowResults(true);
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 2 }}>
                Career Personality Quiz
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 2 }} align="center" color="text.secondary">
                Answer these questions to discover which career paths might be the best fit for your personality type.
            </Typography>
            
            {/* Progress indicator */}
            <Box sx={{ mb: 4, px: 2 }}>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
                    {Object.keys(answers).length} of {questions.length} questions answered
                </Typography>
                <Box sx={{ width: '100%', bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Box
                        sx={{
                            width: `${(Object.keys(answers).length / questions.length) * 100}%`,
                            height: 8,
                            bgcolor: 'primary.main',
                            borderRadius: 1,
                            transition: 'width 0.3s ease-in-out'
                        }}
                    />
                </Box>
            </Box>
            
            {!showResults ? (
                <>
                    {questions.map((q, index) => (
                        <Box key={index} sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                {index + 1}. {q.question}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                                {Object.keys(q.options).map(option => (
                                    <Box 
                                        key={option} 
                                        sx={{ 
                                            p: 2, 
                                            border: 1, 
                                            borderColor: answers[index] === option ? 'primary.main' : 'grey.300',
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                            bgcolor: answers[index] === option ? 'primary.light' : 'transparent',
                                            '&:hover': {
                                                bgcolor: answers[index] === option ? 'primary.light' : 'grey.100'
                                            }
                                        }}
                                        onClick={() => handleAnswerChange(index, option)}
                                    >
                                        <Typography variant="body1">
                                            {q.options[option]}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ))}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large" 
                            onClick={calculateResults}
                            sx={{ px: 4, py: 1 }}
                        >
                            Submit
                        </Button>
                    </Box>
                </>
            ) : (
                <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h5" gutterBottom color="primary.main">
                        Your Personality Type: {result.type}
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                        {result.description}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Recommended Career Paths:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 400, mx: 'auto', mb: 3 }}>
                        {result.careers.map((career, index) => (
                            <Box 
                                key={index} 
                                sx={{ 
                                    p: 2, 
                                    bgcolor: 'primary.light', 
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: 'primary.main',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                                onClick={() => navigate(`/jobs?category=${encodeURIComponent(career)}`)}
                            >
                                <Typography variant="body1">{career}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <Button 
                        variant="outlined" 
                        color="primary"
                        onClick={() => {
                            setShowResults(false);
                            setAnswers({});
                            setResult(null);
                        }}
                    >
                        Retake Quiz
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        sx={{ ml: 2 }}
                        onClick={() => navigate('/jobs')}
                    >
                        Browse Jobs
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default PersonalityQuiz;

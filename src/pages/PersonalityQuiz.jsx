import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  LinearProgress,
  Grid,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  IconButton,
  Fade,
  Grow
} from '@mui/material';
import { auth } from '../firebase';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import WorkIcon from '@mui/icons-material/Work';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BrushIcon from '@mui/icons-material/Brush';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import ShareIcon from '@mui/icons-material/Share';

const PersonalityQuiz = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isMedium = useMediaQuery(theme.breakpoints.down('md'));

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [animateQuestion, setAnimateQuestion] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Personality type icons mapping
    const personalityIcons = {
        'Analytical Thinker': <AnalyticsIcon sx={{ fontSize: 40 }} />,
        'Creative Innovator': <BrushIcon sx={{ fontSize: 40 }} />,
        'Systematic Executor': <BuildIcon sx={{ fontSize: 40 }} />,
        'People-Focused Collaborator': <PeopleIcon sx={{ fontSize: 40 }} />
    };

    // Career icons mapping
    const careerIcons = {
        'Technology': '💻',
        'Finance': '💰',
        'Engineering': '🔧',
        'Design': '🎨',
        'Marketing': '📊',
        'Sales': '🤝',
        'Customer Service': '🎯',
        'Human Resources': '👥'
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <PsychologyIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2, opacity: 0.7 }} />
                <Typography variant="h5" sx={{ mb: 4 }}>Loading your career assessment...</Typography>
                <LinearProgress sx={{ maxWidth: 400, mx: 'auto' }} />
            </Container>
        );
    }

    if (!user) {
        return (
            <Paper
                elevation={3}
                sx={{
                    textAlign: 'center',
                    py: { xs: 6, md: 8 },
                    px: { xs: 3, md: 4 },
                    borderRadius: 3,
                    maxWidth: 'md',
                    mx: 'auto',
                    mt: 4,
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)'
                }}
            >
                <BusinessCenterIcon sx={{ fontSize: { xs: 50, md: 60 }, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                    Please sign in to access the Career Assessment
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    paragraph
                    sx={{
                        maxWidth: 600,
                        mx: 'auto',
                        mb: 4,
                        fontSize: { xs: '0.95rem', md: '1rem' }
                    }}
                >
                    Sign in to discover your career personality type and find job opportunities that match your strengths and preferences.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/signin')}
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        boxShadow: '0 4px 14px rgba(0, 118, 255, 0.39)',
                        '&:hover': {
                            boxShadow: '0 6px 20px rgba(0, 118, 255, 0.45)',
                            transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s ease-in-out'
                    }}
                >
                    Sign In
                </Button>
            </Paper>
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
                description: 'You excel at analyzing data and solving complex problems. You prefer working with facts and figures, making you well-suited for roles that require critical thinking and detailed analysis.',
                strengths: ['Data analysis', 'Problem-solving', 'Critical thinking', 'Attention to detail', 'Logical reasoning'],
                careers: ['Technology', 'Finance', 'Engineering']
            },
            B: {
                type: 'Creative Innovator',
                description: 'You thrive on creativity and innovation. You enjoy thinking outside the box and developing new ideas, making you ideal for roles that require imagination and original thinking.',
                strengths: ['Creative thinking', 'Innovation', 'Adaptability', 'Vision', 'Artistic expression'],
                careers: ['Design', 'Marketing']
            },
            C: {
                type: 'Systematic Executor',
                description: 'You excel at implementing systems and processes. You are detail-oriented and methodical in your approach, making you perfect for roles that require precision and organization.',
                strengths: ['Organization', 'Efficiency', 'Reliability', 'Process improvement', 'Methodical approach'],
                careers: ['Technology', 'Engineering']
            },
            D: {
                type: 'People-Focused Collaborator',
                description: 'You are skilled at understanding people and facilitating collaboration. You thrive in social environments, making you well-suited for roles that involve teamwork and communication.',
                strengths: ['Communication', 'Empathy', 'Team building', 'Relationship management', 'Conflict resolution'],
                careers: ['Sales', 'Customer Service', 'Human Resources']
            }
        };

        // Calculate percentages for each personality type
        const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
        const percentages = {};
        Object.keys(counts).forEach(key => {
            percentages[key] = Math.round((counts[key] / total) * 100);
        });

        setResult({
            ...personalityTypes[dominantType],
            percentages,
            dominantType
        });
        setShowResults(true);
    };

    const handleNextQuestion = () => {
        if (activeQuestion < questions.length - 1) {
            setAnimateQuestion(false);
            setTimeout(() => {
                setActiveQuestion(prev => prev + 1);
                setAnimateQuestion(true);
            }, 300);
        } else {
            calculateResults();
        }
    };

    const handlePrevQuestion = () => {
        if (activeQuestion > 0) {
            setAnimateQuestion(false);
            setTimeout(() => {
                setActiveQuestion(prev => prev - 1);
                setAnimateQuestion(true);
            }, 300);
        }
    };

    const isQuestionAnswered = (index) => {
        return answers[index] !== undefined;
    };

    const getOptionColor = (option) => {
        switch(option) {
            case 'A': return '#3b82f6'; // blue
            case 'B': return '#8b5cf6'; // purple
            case 'C': return '#10b981'; // green
            case 'D': return '#f59e0b'; // amber
            default: return theme.palette.primary.main;
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
            {!showResults ? (
                <>
                    <Box sx={{
                        textAlign: 'center',
                        mb: 5,
                        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
                        p: { xs: 3, md: 5 },
                        borderRadius: 3,
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Background Pattern */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                opacity: 0.1,
                                background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
                            }}
                        />

                        <Box sx={{ position: 'relative', zIndex: 2 }}>
                            <PsychologyIcon sx={{ fontSize: { xs: 40, md: 60 }, mb: 2 }} />
                            <Typography
                                variant="h3"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                                    mb: 1,
                                    textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                }}
                            >
                                Career Personality Assessment
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    maxWidth: 700,
                                    mx: 'auto',
                                    mb: 3,
                                    fontWeight: 400,
                                    opacity: 0.9,
                                    fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' }
                                }}
                            >
                                Discover your professional strengths and find the perfect career path that matches your personality
                            </Typography>
                        </Box>
                    </Box>

                    {/* Progress indicator */}
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Question {activeQuestion + 1} of {questions.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {Object.keys(answers).length} of {questions.length} answered
                            </Typography>
                        </Box>
                        <Box sx={{ width: '100%', bgcolor: 'grey.100', borderRadius: 2, height: 10, overflow: 'hidden' }}>
                            <Box
                                sx={{
                                    width: `${(Object.keys(answers).length / questions.length) * 100}%`,
                                    height: '100%',
                                    bgcolor: 'primary.main',
                                    borderRadius: 2,
                                    transition: 'width 0.5s ease-in-out'
                                }}
                            />
                        </Box>

                        {/* Question navigation dots */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, flexWrap: 'wrap', gap: 1 }}>
                            {questions.map((_, index) => (
                                <Box
                                    key={index}
                                    onClick={() => {
                                        setAnimateQuestion(false);
                                        setTimeout(() => {
                                            setActiveQuestion(index);
                                            setAnimateQuestion(true);
                                        }, 300);
                                    }}
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        bgcolor: isQuestionAnswered(index)
                                            ? 'primary.main'
                                            : 'grey.300',
                                        border: activeQuestion === index
                                            ? '2px solid'
                                            : 'none',
                                        borderColor: 'primary.main',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.2)',
                                            bgcolor: isQuestionAnswered(index)
                                                ? 'primary.dark'
                                                : 'grey.400'
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Current question */}
                    <Fade in={animateQuestion} timeout={500}>
                        <Card
                            elevation={3}
                            sx={{
                                mb: 4,
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                overflow: 'visible'
                            }}
                        >
                            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                        color: 'primary.main',
                                        mb: 3
                                    }}
                                >
                                    {activeQuestion + 1}. {questions[activeQuestion].question}
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                                    {Object.keys(questions[activeQuestion].options).map(option => (
                                        <Grow
                                            key={option}
                                            in={animateQuestion}
                                            timeout={500 + (Object.keys(questions[activeQuestion].options).indexOf(option) * 100)}
                                        >
                                            <Paper
                                                elevation={answers[activeQuestion] === option ? 3 : 1}
                                                sx={{
                                                    p: 2.5,
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                    borderLeft: answers[activeQuestion] === option ? '6px solid' : '1px solid',
                                                    borderColor: answers[activeQuestion] === option
                                                        ? getOptionColor(option)
                                                        : 'grey.300',
                                                    bgcolor: answers[activeQuestion] === option
                                                        ? `${getOptionColor(option)}10`
                                                        : 'background.paper',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: answers[activeQuestion] === option
                                                            ? '0 8px 20px rgba(0, 0, 0, 0.15)'
                                                            : '0 4px 12px rgba(0, 0, 0, 0.08)',
                                                        borderLeftColor: getOptionColor(option),
                                                        borderLeftWidth: '6px'
                                                    }
                                                }}
                                                onClick={() => handleAnswerChange(activeQuestion, option)}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: answers[activeQuestion] === option
                                                                ? getOptionColor(option)
                                                                : 'grey.200',
                                                            color: answers[activeQuestion] === option
                                                                ? 'white'
                                                                : 'text.secondary',
                                                            width: 36,
                                                            height: 36,
                                                            mr: 2,
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {option}
                                                    </Avatar>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: answers[activeQuestion] === option ? 600 : 400,
                                                            color: answers[activeQuestion] === option
                                                                ? 'text.primary'
                                                                : 'text.secondary'
                                                        }}
                                                    >
                                                        {questions[activeQuestion].options[option]}
                                                    </Typography>
                                                    {answers[activeQuestion] === option && (
                                                        <CheckCircleIcon
                                                            sx={{
                                                                ml: 'auto',
                                                                color: getOptionColor(option)
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </Paper>
                                        </Grow>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Fade>

                    {/* Navigation buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handlePrevQuestion}
                            disabled={activeQuestion === 0}
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                borderRadius: 2,
                                px: 3
                            }}
                        >
                            Previous
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNextQuestion}
                            disabled={!isQuestionAnswered(activeQuestion)}
                            endIcon={activeQuestion < questions.length - 1 ? <ArrowForwardIcon /> : null}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                boxShadow: '0 4px 14px rgba(0, 118, 255, 0.39)',
                                '&:hover': {
                                    boxShadow: '0 6px 20px rgba(0, 118, 255, 0.45)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            {activeQuestion < questions.length - 1 ? 'Next' : 'See Results'}
                        </Button>
                    </Box>
                </>
            ) : (
                <Fade in={showResults} timeout={800}>
                    <Box>
                        <Paper
                            elevation={3}
                            sx={{
                                p: { xs: 3, md: 5 },
                                borderRadius: 3,
                                mb: 4,
                                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Background Pattern */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    opacity: 0.05,
                                    background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
                                }}
                            />

                            <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                    <Avatar
                                        sx={{
                                            width: { xs: 80, md: 100 },
                                            height: { xs: 80, md: 100 },
                                            bgcolor: 'primary.main',
                                            boxShadow: '0 8px 32px rgba(37, 99, 235, 0.2)'
                                        }}
                                    >
                                        {personalityIcons[result.type]}
                                    </Avatar>
                                </Box>

                                <Typography
                                    variant="h4"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 800,
                                        color: 'primary.dark',
                                        mb: 1
                                    }}
                                >
                                    Your Personality Type: {result.type}
                                </Typography>

                                <Typography
                                    variant="body1"
                                    paragraph
                                    sx={{
                                        mb: 4,
                                        maxWidth: 700,
                                        mx: 'auto',
                                        fontSize: '1.1rem',
                                        color: 'text.secondary'
                                    }}
                                >
                                    {result.description}
                                </Typography>

                                {/* Personality breakdown */}
                                <Grid container spacing={2} sx={{ mb: 4, mt: 2 }}>
                                    <Grid item xs={12} md={6}>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                height: '100%',
                                                bgcolor: 'white'
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{
                                                    fontWeight: 700,
                                                    color: 'primary.main',
                                                    mb: 2
                                                }}
                                            >
                                                Your Key Strengths
                                            </Typography>

                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {result.strengths.map((strength, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={strength}
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{
                                                            borderRadius: 4,
                                                            fontWeight: 500,
                                                            px: 1
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                height: '100%',
                                                bgcolor: 'white'
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{
                                                    fontWeight: 700,
                                                    color: 'primary.main',
                                                    mb: 2
                                                }}
                                            >
                                                Personality Breakdown
                                            </Typography>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="body2" fontWeight={600}>Analytical Thinker</Typography>
                                                        <Typography variant="body2">{result.percentages.A}%</Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={result.percentages.A}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            bgcolor: '#e0f2fe',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: '#3b82f6'
                                                            }
                                                        }}
                                                    />
                                                </Box>

                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="body2" fontWeight={600}>Creative Innovator</Typography>
                                                        <Typography variant="body2">{result.percentages.B}%</Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={result.percentages.B}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            bgcolor: '#f3e8ff',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: '#8b5cf6'
                                                            }
                                                        }}
                                                    />
                                                </Box>

                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="body2" fontWeight={600}>Systematic Executor</Typography>
                                                        <Typography variant="body2">{result.percentages.C}%</Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={result.percentages.C}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            bgcolor: '#dcfce7',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: '#10b981'
                                                            }
                                                        }}
                                                    />
                                                </Box>

                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="body2" fontWeight={600}>People-Focused Collaborator</Typography>
                                                        <Typography variant="body2">{result.percentages.D}%</Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={result.percentages.D}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            bgcolor: '#fef3c7',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: '#f59e0b'
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>

                        <Paper
                            elevation={3}
                            sx={{
                                p: { xs: 3, md: 4 },
                                borderRadius: 3,
                                mb: 4,
                                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Background Pattern */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    opacity: 0.1,
                                    background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
                                }}
                            />

                            <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3
                                    }}
                                >
                                    Recommended Career Paths
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 4,
                                        maxWidth: 700,
                                        mx: 'auto',
                                        opacity: 0.9
                                    }}
                                >
                                    Based on your personality assessment, these career paths align well with your strengths and preferences.
                                    Click on any category to explore available job opportunities.
                                </Typography>

                                <Grid container spacing={2} justifyContent="center">
                                    {result.careers.map((career, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Paper
                                                elevation={4}
                                                sx={{
                                                    p: 3,
                                                    borderRadius: 3,
                                                    cursor: 'pointer',
                                                    bgcolor: 'white',
                                                    color: 'text.primary',
                                                    textAlign: 'center',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)'
                                                    }
                                                }}
                                                onClick={() => navigate(`/jobs?category=${encodeURIComponent(career)}`)}
                                            >
                                                <Typography
                                                    variant="h2"
                                                    sx={{
                                                        fontSize: '3rem',
                                                        mb: 2
                                                    }}
                                                >
                                                    {careerIcons[career] || '🚀'}
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mb: 1
                                                    }}
                                                >
                                                    {career}
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    sx={{ mt: 2, borderRadius: 6, px: 2 }}
                                                >
                                                    Explore Jobs
                                                </Button>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Paper>

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, flexWrap: 'wrap' }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<RestartAltIcon />}
                                onClick={() => {
                                    setShowResults(false);
                                    setAnswers({});
                                    setResult(null);
                                    setActiveQuestion(0);
                                }}
                                sx={{
                                    borderRadius: 2,
                                    px: 3
                                }}
                            >
                                Retake Quiz
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<WorkIcon />}
                                onClick={() => navigate('/jobs')}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    boxShadow: '0 4px 14px rgba(0, 118, 255, 0.39)',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px rgba(0, 118, 255, 0.45)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Browse All Jobs
                            </Button>

                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<ShareIcon />}
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: 'My Career Personality Result',
                                            text: `I'm a ${result.type}! Check out this career assessment quiz.`,
                                            url: window.location.href,
                                        });
                                    } else {
                                        alert('Sharing is not supported on this browser.');
                                    }
                                }}
                                sx={{
                                    borderRadius: 2,
                                    px: 3
                                }}
                            >
                                Share Results
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            )}
        </Container>
    );
};

export default PersonalityQuiz;

import React, { useState } from 'react';

const PersonalityAssessment = () => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const questions = [
        {
            question: "How do you approach problem-solving?",
            options: {
                A: "I analyze data and trends before making a decision. (Best for Analysts, Software Developers)",
                B: "I brainstorm creative ideas to find innovative solutions. (Best for Designers, Writers, Marketers)",
                C: "I rely on logic and structured methodologies. (Best for Editors, Developers, Analysts)",
                D: "I consider user needs and business goals before deciding. (Best for Marketers, Analysts, Designers)"
            }
        },
        {
            question: "How do you prefer to communicate?",
            options: {
                A: "I like to write detailed reports and emails. (Best for Writers, Editors)",
                B: "I prefer visual presentations and designs. (Best for Designers, Marketers)",
                C: "I enjoy discussing ideas in meetings. (Best for Analysts, Developers)",
                D: "I communicate through data and analytics. (Best for Analysts, Software Developers)"
            }
        },
        {
            question: "What type of projects do you enjoy the most?",
            options: {
                A: "Creative writing and content creation. (Best for Writers, Editors)",
                B: "Designing user interfaces and experiences. (Best for Designers)",
                C: "Developing software and applications. (Best for Software Developers)",
                D: "Analyzing market trends and data. (Best for Analysts, Marketers)"
            }
        },
        {
            question: "How do you handle feedback?",
            options: {
                A: "I appreciate constructive criticism and use it to improve. (Best for Editors, Writers)",
                B: "I prefer positive reinforcement and encouragement. (Best for Designers, Marketers)",
                C: "I analyze feedback logically to make adjustments. (Best for Analysts, Developers)",
                D: "I seek feedback to align with user needs. (Best for Marketers, Analysts)"
            }
        },
        {
            question: "What motivates you in your work?",
            options: {
                A: "Creating impactful content. (Best for Writers, Editors)",
                B: "Bringing ideas to life through design. (Best for Designers)",
                C: "Solving complex problems with technology. (Best for Software Developers)",
                D: "Understanding and influencing market dynamics. (Best for Analysts, Marketers)"
            }
        },
    ];

    const handleAnswerChange = (questionIndex, option) => {
        setAnswers({
            ...answers,
            [questionIndex]: option
        });
    };

    const calculateResults = () => {
        const scores = {
            Writer: 0,
            Editor: 0,
            SoftwareDeveloper: 0,
            Designer: 0,
            Marketer: 0,
            Analyst: 0
        };

        questions.forEach((question, index) => {
            const answer = answers[index];
            if (answer) {
                const selectedOption = question.options[answer];
                if (selectedOption) {
                    const roleMatches = selectedOption.match(/\(Best for (.*?)\)/);
                    if (roleMatches) {
                        const roles = roleMatches[1].split(', ');
                        roles.forEach(role => {
                            scores[role.trim()] += 1;
                        });
                    }
                }
            }
        });

        const highestScoreRole = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        return highestScoreRole;
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Personality Assessment</h1>
            {questions.map((q, index) => (
                <div key={index} className="mb-4">
                    <h3 className="font-semibold">{q.question}</h3>
                    {Object.keys(q.options).map(option => (
                        <div key={option} className="flex items-center mb-2">
                            <input
                                type="radio"
                                name={`question-${index}`}
                                value={option}
                                onChange={() => handleAnswerChange(index, option)}
                                className="mr-2"
                            />
                            <label>{q.options[option]}</label>
                        </div>
                    ))}
                </div>
            ))}
            <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => { calculateResults(); setSubmitted(true); }}>Submit</button>
            {submitted && <div className="mt-4">Your most suitable job role is: {calculateResults()}</div>}
        </div>
    );
};

export default PersonalityAssessment;

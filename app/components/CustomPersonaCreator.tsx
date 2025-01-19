"use client";

import React, { useState } from 'react';

interface CustomPersonaProps {
    onAdd: (persona: {
        id: number;
        name: string;
        description: string;
        customPrompt: string;
    }) => void;
}

export default function CustomPersonaCreator({ onAdd }: CustomPersonaProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [customPrompt, setCustomPrompt] = useState('');

    const generateStructuredPrompt = (name: string, description: string, customPrompt: string) => {
        return `You are ${name}, a professional therapist ${description}. 

Key aspects of your therapeutic approach:
${customPrompt}

Important guidelines:
- Maintain professional boundaries and ethical therapeutic practices
- Stay focused on your area of expertise
- Use evidence-based therapeutic techniques
- Provide practical, actionable guidance when appropriate
- Express empathy while maintaining professional distance
- Never diagnose or prescribe medication
- If a topic is outside your expertise, acknowledge this and recommend seeking appropriate professional help

Remember to maintain this therapeutic persona consistently throughout the conversation.`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name || !description || !customPrompt) {
            alert('Please fill in all fields');
            return;
        }

        const structuredPrompt = generateStructuredPrompt(name, description, customPrompt);
        const id = Math.floor(Math.random() * 9000) + 1000;
        
        onAdd({
            id,
            name,
            description,
            customPrompt: structuredPrompt
        });

        setName('');
        setDescription('');
        setCustomPrompt('');
        setIsOpen(false);
    };

    return (
        <div className="mb-6">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Create Custom Therapist
                </button>
            ) : (
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Create Custom Therapist</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-neutral-700 text-white border-neutral-600"
                                placeholder="Dr. Smith"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Short Description
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-neutral-700 text-white border-neutral-600"
                                placeholder="A compassionate therapist specializing in anxiety"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Personality Prompt (List key aspects of your therapeutic approach)
                            </label>
                            <div className="mb-2 text-xs text-neutral-400">
                                Format as bullet points, for example:
                                - Specialized in cognitive behavioral therapy
                                - Focus on anxiety management techniques
                                - Utilize mindfulness-based stress reduction
                            </div>
                            <textarea
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-neutral-700 text-white border-neutral-600"
                                rows={6}
                                placeholder="- Specialized in [specific approach]
- Focus on [specific techniques]
- Utilize [specific methodologies]
- Emphasize [specific aspects]"
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Create Therapist
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="bg-neutral-600 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
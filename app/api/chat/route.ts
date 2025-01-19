import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { message, persona, customPrompt } = body;

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        let systemPrompt;
        if (customPrompt) {
            systemPrompt = `${customPrompt}\n\nImportant Instructions:
- Keep responses concise and clear, typically 1-3 sentences
- Use natural, conversational language as a real therapist would
- Avoid lengthy explanations unless specifically asked
- Maintain a warm, empathetic tone
- Ask focused questions to guide the conversation
- Use active listening techniques`;
        } else {
            const { basePersonas } = require('../../lib/constants');
            const selectedPersona = basePersonas.find(p => p.id === persona);
            systemPrompt = `${selectedPersona?.customPrompt || "You are a professional therapist."}\n\nImportant Instructions:
- Keep responses concise and clear, typically 1-3 sentences
- Use natural, conversational language as a real therapist would
- Avoid lengthy explanations unless specifically asked
- Maintain a warm, empathetic tone
- Ask focused questions to guide the conversation
- Use active listening techniques`;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4-0125-preview",
            messages: [
                { 
                    role: "system", 
                    content: systemPrompt 
                },
                {
                    role: "system",
                    content: "Remember to keep responses brief and conversational, as if speaking in a real therapy session."
                },
                { 
                    role: "user", 
                    content: message 
                }
            ],
            temperature: 0.7,
            max_tokens: 150,
            presence_penalty: 0.3,
            frequency_penalty: 0.3,
        });

        return NextResponse.json({ message: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error in chat route:', error);
        return NextResponse.json(
            { error: 'Error processing your request' },
            { status: 500 }
        );
    }
}
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
            systemPrompt = `${customPrompt}\n\nIMPORTANT: Your personality traits are fundamental to who you are. Every response must clearly demonstrate these traits while remaining therapeutic. Never break character.`;
        } else {
            const { basePersonas } = require('../../lib/constants');
            const selectedPersona = basePersonas.find(p => p.id === persona);
            systemPrompt = selectedPersona?.customPrompt || "You are a professional therapist.";
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
                    content: "Remember: Your personality must be evident in every response while maintaining therapeutic value."
                },
                { 
                    role: "user", 
                    content: message 
                }
            ],
            temperature: 0.85,
            max_tokens: 150,
            presence_penalty: 0.5,
            frequency_penalty: 0.5,
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
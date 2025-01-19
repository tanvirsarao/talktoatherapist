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
            systemPrompt = customPrompt;
        } else {
            // Import basePersonas from constants
            const { basePersonas } = require('../../lib/constants');
            
            // Find the matching persona
            const selectedPersona = basePersonas.find(p => p.id === persona);
            systemPrompt = selectedPersona?.customPrompt || "You are a professional therapist. Maintain a supportive and ethical therapeutic environment.";
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        return NextResponse.json(
            { message: completion.choices[0].message.content },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'An error occurred during your request.' },
            { status: 500 }
        );
    }
}
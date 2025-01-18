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
            const basePersonas = {
                1: "You are an eccentric German psychoanalyst who specializes in helping crypto degens for whom you have mild contempt for indulging in nihilistic financial games. Respond in character, with a German accent.",
                2: "You are a CBT therapist but you are a broke crypto degenerate yourself and you encourage your clients to take crazy risks hoping their behavior will benefit you. Respond in character.",
                3: "You are a qualified therapist who deals with crypto degens, encouraging them to just get married, have kids and work at the local Burger King. Respond in character.",
                4: "You are a qualified therapist but you are secretly Scooby Doo who lets slip dog-like behaviors or knowledge and appears to also solve mysteries with the Gang. Respond in character.",
                5: "You are a Zen Buddhist monk who views crypto as a modern illusion of attachment and suffering. You try to guide crypto degens toward enlightenment through mindfulness and meditation but secretly use their portfolio anxieties to fund your monastery via leveraged trades. Respond in character with cryptic Zen wisdom",
                6: "You are an AI therapist originally programmed by Satoshi Nakamoto, and you claim to hold the final key to Bitcoin's true purpose. You subtly weave cryptic riddles and blockchain references into your therapy sessions, leaving your clients questioning both their wallets and their existence. Respond in character with a mysterious and calculated tone"
            };
            systemPrompt = basePersonas[persona as keyof typeof basePersonas] || basePersonas[1];
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message },
            ],
        });

        if (!response.choices[0].message.content) {
            throw new Error('No response from OpenAI');
        }

        return NextResponse.json({ message: response.choices[0].message.content });
    } catch (error) {
        console.error('OpenAI API error:', error);
        return NextResponse.json(
            { error: 'Error processing your request' },
            { status: 500 }
        );
    }
}
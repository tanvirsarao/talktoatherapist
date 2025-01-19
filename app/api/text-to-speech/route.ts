import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { text, voiceId, modelId, stability, similarityBoost, style, speakerBoost } = await request.json();

        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': process.env.ELEVENLABS_API_KEY!,
                },
                body: JSON.stringify({
                    text,
                    model_id: modelId,
                    voice_settings: {
                        stability,
                        similarity_boost: similarityBoost,
                        style,
                        use_speaker_boost: speakerBoost,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('ElevenLabs API error:', errorData);
            throw new Error('Failed to generate speech');
        }

        const audioBuffer = await response.arrayBuffer();
        
        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
            },
        });
    } catch (error) {
        console.error('Text-to-speech error:', error);
        return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
    }
} 
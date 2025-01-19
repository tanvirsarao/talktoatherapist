import { NextResponse } from "next/server";
import textToSpeech from "@google-cloud/text-to-speech";

// 1. Create a client that uses your service account credentials.
//    For local dev, you can rely on GOOGLE_APPLICATION_CREDENTIALS environment variable
//    or parse a JSON string from process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON.
console.log(JSON.parse(process.env.GOOGLE_API_KEY || "{}"));
const client = new textToSpeech.TextToSpeechClient({
    credentials: JSON.parse(process.env.GOOGLE_API_KEY || "{}"),
});

// 2. Map your old ElevenLabs voice IDs to Google Cloud TTS voices.
//    The comments match your original descriptions:
const GOOGLE_VOICE_MAPPING: Record<string, string> = {
    // Female, warm and empathetic for Dr. Sarah
    "pNInz6obpgDQGcFmaJgB": "en-US-Neural2-F",

    // Male, calm and reassuring for Dr. Michael
    "ErXwobaYiN019PkySvjV": "en-US-Neural2-D",

    // Female, confident for Dr. Rachel
    "EXAVITQu4vr4xnSDxMaL": "en-US-Neural2-C",

    // Male, friendly for Dr. James
    "yoZ06aMxZJJ28mfd3POQ": "en-US-Neural2-B",

    // Female, warm for Dr. Maria
    "ThT5KcBeYPX3keUQqHPh": "en-US-Neural2-H",

    // Male, professional for Dr. David
    "TxGEqnHWrfWFTfGW9XjX": "en-US-Neural2-I",
};

// 3. Keep the same POST signature, do not change the name or path
export async function POST(request: Request) {
    try {
        // Destructure the fields your client passes in, but we only really use 'text' and 'voiceId'
        const { text, voiceId, modelId, stability, similarityBoost, style, speakerBoost } = await request.json();

        // Google TTS doesn't use modelId/stability/similarityBoost/style/speakerBoost the same way
        // We'll ignore them for now and just pick the correct voice based on voiceId
        const googleVoiceName = GOOGLE_VOICE_MAPPING[voiceId] || "en-US-Neural2-F";

        // 4. Call Google Cloud TTS
        const [ttsResponse] = await client.synthesizeSpeech({
            input: { text },
            voice: {
                // Adjust these as desired
                languageCode: "en-US",
                name: googleVoiceName,
            },
            audioConfig: {
                audioEncoding: "MP3",
                // Optionally set pitch, speakingRate, etc. to get closer to original style
                // pitch: 0,
                // speakingRate: 1.0,
            },
        });

        const audioContent = ttsResponse.audioContent as string;
        if (!audioContent) {
            throw new Error("No audio content returned by Google TTS");
        }

        const audioBuffer = Buffer.from(audioContent, "base64");


        // 6. Return as NextResponse with 'audio/mpeg'
        return new NextResponse(audioBuffer, {
            headers: {
                "Content-Type": "audio/mpeg",
            },
        });
    } catch (error) {
        console.error("Text-to-speech error:", error);
        return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
    }
}

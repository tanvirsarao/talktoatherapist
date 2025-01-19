"use client";

import React, { useState, useEffect } from "react";

interface Message {
    role: string;
    content: string;
}

interface SpeechProps {
    selectedPersona: number;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

// Map personas to specific voice IDs from ElevenLabs
const VOICE_MAPPING = {
    1: "pNInz6obpgDQGcFmaJgB", // Female, warm and empathetic for Dr. Sarah
    2: "ErXwobaYiN019PkySvjV", // Male, calm and reassuring for Dr. Michael
    3: "EXAVITQu4vr4xnSDxMaL", // Female, confident for Dr. Rachel
    4: "yoZ06aMxZJJ28mfd3POQ", // Male, friendly for Dr. James
    5: "ThT5KcBeYPX3keUQqHPh", // Female, warm for Dr. Maria
    6: "TxGEqnHWrfWFTfGW9XjX"  // Male, professional for Dr. David
};

export default function Speech({ selectedPersona, messages, setMessages }: SpeechProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === "assistant" && !isPlaying) {
            playResponse(lastMessage.content);
        }
    }, [messages]);

    const playResponse = async (text: string) => {
        try {
            console.log('playing audio...')
            const response = await fetch("/api/text-to-speech", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text,
                    voiceId: VOICE_MAPPING[selectedPersona as keyof typeof VOICE_MAPPING],
                    modelId: "eleven_monolingual_v1",
                    stability: 0.3,
                    similarityBoost: 0.85,
                    style: 1.0,
                    speakerBoost: true,
                }),
            });

            if (!response.ok) throw new Error("Failed to generate speech");

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);

            audio.onended = () => {
                setIsPlaying(false);
                URL.revokeObjectURL(audioUrl);
            };

            setIsPlaying(true);
            await audio.play();
        } catch (error) {
            console.error("Error playing audio:", error);
            setIsPlaying(false);
        }
    };

    return null; // This component only handles speech, no UI needed
}

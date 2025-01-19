// SpeechRecorder.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaArrowUp } from "react-icons/fa";

interface Message {
    role: string;
    content: string;
}

interface SpeechRecorderProps {
    selectedPersona: number | null;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    isMuted: boolean;
}

interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

// Map personas to specific Google Cloud TTS voice names
const VOICE_MAPPING: Record<number, string> = {
    1: "en-US-Neural2-F", // Female, warm and empathetic for Dr. Sarah
    2: "en-US-Neural2-D", // Male, calm and reassuring for Dr. Michael
    3: "en-US-Neural2-C", // Female, confident for Dr. Rachel
    4: "en-US-Neural2-B", // Male, friendly for Dr. James
    5: "en-US-Neural2-H", // Female, warm for Dr. Maria
    6: "en-US-Neural2-I", // Male, professional for Dr. David
};

export default function SpeechRecorder({
    selectedPersona,
    messages,
    setMessages,
    isMuted,
}: SpeechRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [partialTranscript, setPartialTranscript] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const lastResultTimeRef = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize speech recognition
    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn("This browser does not support the Web Speech API.");
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            lastResultTimeRef.current = Date.now();
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setPartialTranscript(transcript);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error:", event.error);
        };

        recognitionRef.current.onend = () => {
            console.log("Speech recognition service disconnected");
            if (isRecording) {
                // Automatically restart recognition if still recording
                recognitionRef.current?.start();
            }
        };

        return () => {
            stopCheckSilence();
            recognitionRef.current?.stop();
        };
    }, [isRecording]);

    // Start or stop silence checking based on recording state
    useEffect(() => {
        if (isRecording) {
            startCheckSilence();
        } else {
            stopCheckSilence();
        }
    }, [isRecording]);

    // Handle mute state changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }

        if (isMuted && isSpeaking && audioRef.current) {
            audioRef.current.pause();
            setIsSpeaking(false);
        }
    }, [isMuted]);

    // Automatically speak assistant messages when not muted
    useEffect(() => {
        if (!isMuted && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant' && !isSpeaking) {
                handleResponse(lastMessage.content);
            }
        }
    }, [isMuted, messages, isSpeaking]);

    const startRecording = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        setPartialTranscript("");
        lastResultTimeRef.current = Date.now();
        recognitionRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (!recognitionRef.current) return;
        try {
            recognitionRef.current.stop();
            setIsRecording(false);

            if (partialTranscript.trim()) {
                finalizeChunk(partialTranscript.trim());
                setPartialTranscript("");
            }
        } catch (error) {
            console.error("Error stopping recognition:", error);
            setIsRecording(false);
        }
    };

    const startCheckSilence = () => {
        if (intervalRef.current) return;
        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const diff = now - lastResultTimeRef.current;
            if (diff >= 2000 && partialTranscript.trim()) {
                const chunk = partialTranscript.trim();
                setPartialTranscript("");
                finalizeChunk(chunk);
            }
        }, 500);
    };

    const stopCheckSilence = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const speakResponse = async (text: string) => {
        try {
            console.log('playing audio...', selectedPersona);
            const response = await fetch("/api/text-to-speech", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text,
                    voiceId: VOICE_MAPPING[selectedPersona as keyof typeof VOICE_MAPPING] || VOICE_MAPPING[1],
                    // These fields are kept for compatibility but not used by Google TTS
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

            // Create the Audio object and store it in the ref
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            // Apply the current mute state
            audio.muted = isMuted;

            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(audioUrl);
                audioRef.current = null;
            };

            setIsSpeaking(true);
            await audio.play();
        } catch (error) {
            console.error("Error playing audio:", error);
            setIsSpeaking(false);
        }
    }

    const finalizeChunk = async (chunk: string) => {
        // Add user message
        setMessages((prev: Message[]) => [...prev, { role: "user", content: chunk }]);

        try {
            // Call your chat API
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: chunk,
                    persona: selectedPersona,
                }),
            });

            const data = await response.json();
            setMessages((prev: Message[]) => [...prev, { role: "assistant", content: data.message }]);
            handleResponse(data.message);
        } catch (error) {
            console.error("Error calling chat API:", error);
        }

        // Restart recognition if still recording
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            setTimeout(() => {
                if (isRecording) {
                    recognitionRef.current?.start();
                }
            }, 300);
        }
    };

    const handleResponse = async (response: string) => {
        if (!isMuted) {
            await speakResponse(response);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!textInput.trim()) return;

        const message = textInput.trim();
        setTextInput("");
        finalizeChunk(message);
    };

    return (
        <div className="flex gap-4 items-end">
            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-4 rounded-full transition-all ${isRecording
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-primary-600 hover:bg-primary-700'
                    }`}
            >
                <FaMicrophone className="h-5 w-5 text-white" />
            </button>

            <div className="flex-grow space-y-4">
                {isRecording && (
                    <div className="w-full">
                        <div className="mt-2 p-3 bg-neutral-700 rounded-lg min-h-[3em] text-white">
                            {partialTranscript}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full flex gap-2 relative">
                    <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="w-full px-4 py-3 rounded-lg bg-neutral-700 text-white placeholder-neutral-400 pr-12 border-none focus:ring-2 focus:ring-neutral-500 transition-all"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-neutral-600 transition-colors group"
                    >
                        <FaArrowUp className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors" />
                    </button>
                </form>
            </div>
        </div>
    );
}

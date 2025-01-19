"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaArrowUp } from "react-icons/fa";

interface Message {
    role: string;
    content: string;
}

interface SpeechRecorderProps {
    selectedPersona: number;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
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

export default function SpeechRecorder({
    selectedPersona,
    messages,
    setMessages,
}: SpeechRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [partialTranscript, setPartialTranscript] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const synth = useRef<SpeechSynthesis | null>(null);
    const lastResultTimeRef = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

        recognitionRef.current.onresult = (event: any) => {
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
        };

        // Initialize speech synthesis
        if (typeof window !== 'undefined') {
            synth.current = window.speechSynthesis;
        }

        return () => {
            stopCheckSilence();
            recognitionRef.current?.stop();
        };
    }, []);

    useEffect(() => {
        if (isRecording) {
            startCheckSilence();
        } else {
            stopCheckSilence();
        }
    }, [isRecording]);

    const startRecording = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        // Reinitialize recognition instance
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        // Reattach event handlers
        recognitionRef.current.onresult = (event: any) => {
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
        };

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

    const speakResponse = (text: string) => {
        if (!synth.current) return;

        // Cancel any ongoing speech
        synth.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        synth.current.speak(utterance);
    };

    const finalizeChunk = async (chunk: string) => {
        setMessages(prev => [...prev, { role: "user", content: chunk }]);

        try {
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
            setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
            speakResponse(data.message);
        } catch (error) {
            console.error("Error calling chat API:", error);
        }

        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            setTimeout(() => {
                if (isRecording) {
                    recognitionRef.current?.start();
                }
            }, 300);
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
        <div className="w-full">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className="group relative rounded-full p-px bg-slate-800 hover:bg-slate-700 transition-all duration-300 shadow-xl"
                    >
                        <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-zinc-950 ring-1 ring-white/10">
                            {isRecording ? (
                                <>
                                    <div className="absolute inset-0 rounded-full animate-pulse bg-red-500/20"></div>
                                    <div className="h-4 w-4 rounded bg-red-500"></div>
                                </>
                            ) : (
                                <FaMicrophone className={`h-5 w-5 text-neutral-300 group-hover:text-white transition-colors`} />
                            )}
                        </div>
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-neutral-400">
                            {isRecording ? 'Stop' : 'Record'}
                        </span>
                    </button>
                </div>

                <div className="flex-grow space-y-4">
                    {isRecording && (
                        <div className="w-full">
                            <p className="text-sm text-neutral-400 italic">
                                Listening... (interim transcript below)
                            </p>
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
        </div>
    );
}
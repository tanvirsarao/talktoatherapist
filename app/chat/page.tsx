"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import CustomPersonaCreator from "../components/CustomPersonaCreator";
import SpeechRecorder from "../components/SpeechRecorder";
import Dynamic from "../components/Dynamic";
import { basePersonas } from "../lib/constants";

export default function ChatPage() {
    const router = useRouter();
    const { primaryWallet } = useDynamicContext();
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [selectedPersona, setSelectedPersona] = useState(1);
    const [savedBlobIds, setSavedBlobIds] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [personas, setPersonas] = useState(basePersonas);

    // Reuse existing handlers
    const handleAddCustomPersona = (newPersona: any) => {
        setPersonas(prev => [...prev, newPersona]);
    };

    const handleReset = () => setMessages([]);
    
    const handlePersonaChange = (newPersona: number) => {
        setSelectedPersona(newPersona);
        handleReset();
    };

    // Reuse save/load handlers from original HomeContent component
    // Reference lines from HomeContent.tsx for these handlers
    const handleSave = async () => {
        if (!primaryWallet?.address) {
            alert("Please connect your wallet first");
            return;
        }

        setIsSaving(true);
        try {
            const saveResponse = await fetch("/api/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages, persona: selectedPersona }),
            });

            const saveData = await saveResponse.json();
            if (saveData.success) {
                setSavedBlobIds(prev => ({ ...prev, [saveData.persona]: saveData.blobId }));
                alert("Chat saved successfully!");
            }
        } catch (error) {
            console.error("Error saving chat:", error);
            alert("Failed to save chat. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLoad = async () => {
        const blobId = savedBlobIds[selectedPersona];
        if (!blobId) {
            alert("No saved chat found for this persona.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/fetchBlob?blobId=${blobId}`);
            const data = await response.json();
            setMessages(data.messages);
            alert("Chat loaded successfully!");
        } catch (error) {
            console.error("Error loading chat:", error);
            alert("Failed to load chat. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-bg">
            <div className="pattern-bg absolute inset-0 pointer-events-none" />
            
            {/* Header */}
            <nav className="p-6 flex justify-between items-center relative z-10 backdrop-blur-sm bg-primary-900/30">
                <div className="flex items-center gap-4">
                    <Image
                        src="/raccoon-logo.png"
                        alt="TalkTuahTherapist Logo"
                        width={50}
                        height={50}
                        className="rounded-full"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-white">TalkTuahTherapist</h1>
                        <p className="text-sm text-neutral-300">AI Therapy Session</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/')}
                        className="text-neutral-300 hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </button>
                    <Dynamic />
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8 relative z-10">
                {/* Persona Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {personas.map((persona) => (
                        <div
                            key={persona.id}
                            onClick={() => handlePersonaChange(persona.id)}
                            className={`card-enhanced gradient-border p-6 rounded-xl cursor-pointer transition-all ${
                                selectedPersona === persona.id
                                    ? 'bg-primary-900/50 ring-2 ring-primary-400'
                                    : 'bg-neutral-800/30 hover:bg-primary-900/30'
                            }`}
                        >
                            <h3 className="font-semibold text-lg mb-2 text-white">{persona.name}</h3>
                            <p className="text-sm text-neutral-400">{persona.description}</p>
                        </div>
                    ))}
                </div>

                {/* Chat Interface */}
                <div className="bg-neutral-800/50 backdrop-blur-md rounded-xl p-6 mb-8 shadow-xl">
                    <div className="h-[400px] overflow-y-auto mb-6 space-y-4 custom-scrollbar">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[70%] rounded-lg p-3 ${
                                    message.role === "user" 
                                        ? "bg-primary-600/80 text-white"
                                        : "bg-neutral-700/80 text-white"
                                }`}>
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <SpeechRecorder
                        selectedPersona={selectedPersona}
                        messages={messages}
                        setMessages={setMessages}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-neutral-700/50 hover:bg-neutral-600/50 text-white rounded-lg transition-colors backdrop-blur-sm"
                    >
                        Reset Chat
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-primary-600/80 hover:bg-primary-700/80 text-white rounded-lg transition-colors backdrop-blur-sm disabled:bg-neutral-600/50"
                    >
                        {isSaving ? "Saving..." : "Save Chat"}
                    </button>
                    {savedBlobIds[selectedPersona] && (
                        <button
                            onClick={handleLoad}
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary-600/80 hover:bg-primary-700/80 text-white rounded-lg transition-colors backdrop-blur-sm disabled:bg-neutral-600/50"
                        >
                            {isLoading ? "Loading..." : "Load Chat"}
                        </button>
                    )}
                </div>

                <CustomPersonaCreator onAdd={handleAddCustomPersona} />
            </main>
        </div>
    );
} 
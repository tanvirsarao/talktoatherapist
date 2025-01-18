"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import CustomPersonaCreator from "./CustomPersonaCreator";
import SpeechRecorder from "./SpeechRecorder";
import Dynamic from "./Dynamic";
import { basePersonas } from "../lib/constants";

export default function HomeContent() {
    const { primaryWallet } = useDynamicContext();
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [selectedPersona, setSelectedPersona] = useState(1);
    const [savedBlobIds, setSavedBlobIds] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [personas, setPersonas] = useState(basePersonas);
    const [showChat, setShowChat] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // ... (keep all the existing handler functions)
    const handleAddCustomPersona = (newPersona: any) => {
        setPersonas(prev => [...prev, newPersona]);
    };

    const handleReset = () => {
        setMessages([]);
    };

    const handlePersonaChange = (newPersona: number) => {
        setSelectedPersona(newPersona);
        handleReset();
    };

    const handleSave = async () => {
        if (!primaryWallet || !primaryWallet.address) {
            alert("Please connect your wallet first");
            return;
        }

        setIsSaving(true);
        try {
            const saveResponse = await fetch("/api/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages,
                    persona: selectedPersona,
                }),
            });

            const saveData = await saveResponse.json();

            if (saveData.success) {
                const { blobId, persona } = saveData;

                const storeBlobResponse = await fetch("/api/store-blobid", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        address: primaryWallet.address,
                        persona: persona.toString(),
                        blobId: blobId,
                    }),
                });

                const storeBlobData = await storeBlobResponse.json();

                if (storeBlobData.success) {
                    localStorage.setItem(`persona_${persona}`, blobId);
                    setSavedBlobIds(prev => ({ ...prev, [persona]: blobId }));
                    alert("Chat saved successfully!");
                } else {
                    throw new Error(storeBlobData.message);
                }
            } else {
                throw new Error(saveData.message);
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

    if (!showChat) {
        return (
            <main className="min-h-screen bg-neutral-900 flex flex-col">
                {/* Announcement Banner */}
                <div className="bg-primary-900/50 text-primary-200 py-2 text-center">
                    <p>Introducing TalkTuahTherapist</p>
                </div>

                <nav className="p-6 flex justify-between items-center">
                    <Image
                        src="/raccoon-logo.png"
                        alt="AnonTherapy Logo"
                        width={50}
                        height={50}
                        className="rounded-full"
                    />
                    <Dynamic />
                </nav>
                
                <div className="flex-1 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto w-full">
                    <h1 className="text-6xl font-bold text-white mb-6">What do you want to talk about?</h1>
                    <p className="text-xl text-neutral-400 mb-12">
                        Select therapist
                    </p>

                    {/* Therapist Selection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-8">
                        {personas.map((persona) => (
                            <div
                                key={persona.id}
                                onClick={() => handlePersonaChange(persona.id)}
                                className={`p-4 rounded-lg cursor-pointer transition-all ${
                                    selectedPersona === persona.id
                                        ? 'bg-primary-900/50 border border-primary-500'
                                        : 'bg-neutral-800/50 hover:bg-primary-900/30'
                                }`}
                            >
                                <h3 className="font-semibold text-lg mb-2 text-white">{persona.name}</h3>
                                <p className="text-sm text-neutral-400">
                                    {persona.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Search/Prompt Box */}
                    <div className="w-full max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="How can we help you today?"
                                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        
                        <button
                            onClick={() => setShowChat(true)}
                            className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
                        >
                            Start Session
                        </button>
                    </div>
                </div>

                <footer className="p-6 text-center text-neutral-400">
                    Made with 🥰 by{" "}
                    <Link href="https://www.linkedin.com/in/dev-katyal-67bb1623b/" className="text-primary-400 hover:underline">
                        UofT Hacks Team
                    </Link>
                </footer>
            </main>
        );
    }

    // ... (keep the existing chat interface return statement)
    return (
        <main className="container mx-auto p-4 flex flex-col min-h-screen bg-neutral-900">
            <div className="flex-grow">
                <div className="flex items-center mb-6">
                    <Image
                        src="/raccoon-logo.png"
                        alt="AnonTherapy Logo"
                        width={80}
                        height={80}
                        className="rounded-full mr-4"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-primary-200">Doc2You</h1>
                        <h2 className="text-xl font-semibold text-neutral-400">
                            AI Therapy Chat
                        </h2>
                    </div>
                    <div className="ml-auto">
                        <Dynamic />
                    </div>
                </div>

                <CustomPersonaCreator onAdd={handleAddCustomPersona} />

                <div className="mb-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {personas.map((persona) => (
                            <div
                                key={persona.id}
                                onClick={() => handlePersonaChange(persona.id)}
                                className={`p-4 rounded-lg cursor-pointer transition-all ${
                                    selectedPersona === persona.id
                                        ? 'bg-primary-900 border-2 border-primary-500'
                                        : 'bg-neutral-800 hover:bg-primary-900/50'
                                }`}
                            >
                                <h3 className="font-semibold text-lg mb-2 text-white">{persona.name}</h3>
                                <p className="text-sm text-neutral-400">
                                    {persona.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleReset}
                            className="bg-neutral-600 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Reset Chat
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`${
                                isSaving ? 'bg-neutral-400' : 'bg-primary-600 hover:bg-primary-700'
                            } text-white px-4 py-2 rounded-lg transition-colors`}
                        >
                            {isSaving ? 'Saving...' : 'Save Chat'}
                        </button>

                        {savedBlobIds[selectedPersona] && (
                            <button
                                onClick={handleLoad}
                                disabled={isLoading}
                                className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                {isLoading ? 'Loading...' : 'Load Saved Chat'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-neutral-800 p-4 h-96 overflow-y-auto mb-4 rounded-lg shadow-lg custom-scrollbar">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}
                        >
                            <span
                                className={`inline-block p-2 rounded-lg max-w-[80%] ${
                                    message.role === "user"
                                        ? "bg-primary-600 text-white"
                                        : "bg-neutral-700 text-white"
                                }`}
                            >
                                {message.content}
                            </span>
                        </div>
                    ))}
                </div>

                <SpeechRecorder
                    selectedPersona={selectedPersona}
                    messages={messages}
                    setMessages={setMessages}
                />
            </div>

            <footer className="mt-8 text-center text-neutral-400">
                Made with 🥰 by{" "}
                <Link href="https://www.linkedin.com/in/dev-katyal-67bb1623b/" className="text-primary-400 hover:underline">
                    UofT Hacks Team
                </Link>
            </footer>
        </main>
    );
}
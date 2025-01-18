"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { motion, AnimatePresence } from "framer-motion";
import TherapistCustomizer from "./TherapistCustomizer";
import SpeechRecorder from "./SpeechRecorder";
import Dynamic from "./Dynamic";
import { basePersonas } from "../lib/constants";
import { Vortex } from "../components/ui/vortex";
import { FaPlus } from 'react-icons/fa';

export default function HomeContent() {
    const { primaryWallet } = useDynamicContext();
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [selectedPersona, setSelectedPersona] = useState<number | null>(null);
    const [savedBlobIds, setSavedBlobIds] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [personas, setPersonas] = useState(basePersonas);
    const [showCustomizer, setShowCustomizer] = useState(false);

    const handleReset = () => setMessages([]);
    
    const handlePersonaChange = (newPersona: number) => {
        setSelectedPersona(newPersona);
        handleReset();
    };

    const handleAddCustomTherapist = (therapist: any) => {
        const newPersona = {
            id: Math.floor(Math.random() * 9000) + 1000, // Generate random ID above 1000
            name: therapist.name,
            description: therapist.description,
            customPrompt: therapist.customPrompt
        };
        setPersonas(prev => [...prev, newPersona]);
        setSelectedPersona(newPersona.id);
        setShowCustomizer(false);
    };

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
        if (!selectedPersona) return;
        
        const blobId = savedBlobIds[selectedPersona];
        if (!blobId) {
            alert("No saved chat found for this therapist.");
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
        <div className="min-h-screen relative overflow-hidden">
            <Vortex className="absolute inset-0" baseHue={220} particleCount={500} />
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10"
            >
                <nav className="p-6 backdrop-blur-sm bg-primary-900/30">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
                                <Image
                                    src="/raccoon-logo.png"
                                    alt="TalkTuahTherapist Logo"
                                    width={50}
                                    height={50}
                                    className="rounded-full relative"
                                    priority
                                />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold text-white">TalkTuahTherapist</h1>
                                <p className="text-sm text-neutral-300">AI Therapy Chat</p>
                            </div>
                        </Link>
                        
                        <div className="flex items-center gap-4">
                            <Dynamic />
                        </div>
                    </div>
                </nav>

                <main className="container mx-auto px-4 py-8 relative z-10">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {!selectedPersona ? (
                            <motion.div 
                                className="flex flex-col items-center justify-center py-20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h2 className="text-4xl font-bold text-white mb-8 text-center gradient-text">
                                    Create Your Perfect Therapist
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowCustomizer(true)}
                                    className="flex items-center gap-3 px-8 py-4 bg-primary-600/80 hover:bg-primary-700/80 text-white rounded-lg transition-all backdrop-blur-sm shadow-lg hover:shadow-xl text-lg font-semibold"
                                >
                                    <FaPlus />
                                    <span>Create Custom Therapist</span>
                                </motion.button>
                                
                                {personas.length > 0 && (
                                    <div className="mt-12 text-center">
                                        <p className="text-neutral-400 mb-6">Or choose from our preset therapists:</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {personas.map((persona) => (
                                                <motion.div
                                                    key={persona.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handlePersonaChange(persona.id)}
                                                    className="card-enhanced gradient-border p-6 rounded-xl cursor-pointer"
                                                >
                                                    <h3 className="font-semibold text-lg mb-2 text-white">{persona.name}</h3>
                                                    <p className="text-sm text-neutral-400">{persona.description}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div 
                                className="space-y-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-white">
                                        {personas.find(p => p.id === selectedPersona)?.name}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedPersona(null)}
                                        className="px-4 py-2 bg-neutral-600/50 hover:bg-neutral-700/50 text-white rounded-lg transition-colors"
                                    >
                                        Change Therapist
                                    </button>
                                </div>

                                <div className="bg-neutral-800/50 backdrop-blur-md rounded-xl p-6 shadow-xl border border-neutral-700/50">
                                    <div className="h-[400px] overflow-y-auto mb-6 space-y-4 custom-scrollbar px-4">
                                        <AnimatePresence>
                                            {messages.map((message, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div className={`max-w-[70%] rounded-lg p-4 ${
                                                        message.role === "user" 
                                                            ? "bg-primary-600/80 text-white"
                                                            : "bg-neutral-700/80 text-white"
                                                    } shadow-lg relative group`}>
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                                                        <p className="relative z-10">{message.content}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                    
                                    <SpeechRecorder
                                        selectedPersona={selectedPersona}
                                        messages={messages}
                                        setMessages={setMessages}
                                    />
                                </div>

                                <motion.div 
                                    className="flex flex-wrap gap-4 justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleReset}
                                        className="px-6 py-3 bg-neutral-700/50 hover:bg-neutral-600/50 text-white rounded-lg transition-colors"
                                    >
                                        Reset Chat
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-6 py-3 bg-primary-600/80 hover:bg-primary-700/80 text-white rounded-lg transition-colors disabled:bg-neutral-600/50"
                                    >
                                        {isSaving ? "Saving..." : "Save Chat"}
                                    </motion.button>
                                    {savedBlobIds[selectedPersona] && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleLoad}
                                            disabled={isLoading}
                                            className="px-6 py-3 bg-primary-600/80 hover:bg-primary-700/80 text-white rounded-lg transition-colors disabled:bg-neutral-600/50"
                                        >
                                            {isLoading ? "Loading..." : "Load Chat"}
                                        </motion.button>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </div>
                </main>

                {showCustomizer && (
                    <TherapistCustomizer
                        onSave={handleAddCustomTherapist}
                        onClose={() => setShowCustomizer(false)}
                    />
                )}

                <footer className="p-6 text-center text-neutral-400 relative z-10 backdrop-blur-sm border-t border-primary-800/50">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <Image
                            src="/raccoon-logo.png"
                            alt="TalkTuahTherapist"
                            width={30}
                            height={30}
                            className="rounded-full"
                            priority
                        />
                        <div>
                            Made with 🥰 by{" "}
                            <Link 
                                href="https://www.linkedin.com/in/dev-katyal-67bb1623b/" 
                                className="text-primary-400 hover:text-primary-300 transition-all hover:underline"
                            >
                                UofT Hacks Team
                            </Link>
                        </div>
                    </motion.div>
                </footer>
            </motion.div>
        </div>
    );
}
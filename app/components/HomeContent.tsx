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
import { HoverBorderGradient } from "../components/HoverBorderGradient";
import { useRouter } from "next/navigation";
import ChatMessage from "../components/ChatMessage";

export default function HomeContent() {
    const { primaryWallet } = useDynamicContext();
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [selectedPersona, setSelectedPersona] = useState<number | null>(null);
    const [savedBlobIds, setSavedBlobIds] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [personas, setPersonas] = useState(basePersonas);
    const [showCustomizer, setShowCustomizer] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const router = useRouter();

    const handleReset = () => setMessages([]);
    
    const handlePersonaChange = (newPersona: number) => {
        localStorage.setItem('selectedTherapist', newPersona.toString());
        router.push('/chat');
    };

    const handleAddCustomTherapist = (therapist: any) => {
        const newPersona = {
            id: Math.floor(Math.random() * 9000) + 1000,
            name: therapist.name,
            description: therapist.description,
            customPrompt: therapist.customPrompt
        };
        setPersonas(prev => [...prev, newPersona]);
        localStorage.setItem('selectedTherapist', newPersona.id.toString());
        router.push('/chat');
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

    const handleToggleMute = (muted: boolean) => {
        setIsMuted(muted);
        if (muted) {
            window.speechSynthesis.cancel(); // Immediately stop any ongoing speech
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
                <nav className="p-6 bg-primary-900/30">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="relative">
                                <Image
                                    src="/logo.png"
                                    alt="TalkTuahTherapist Logo"
                                    width={50}
                                    height={50}
                                    className="rounded-full relative"
                                    priority
                                />
                            </div>
                            <h1 className="text-2xl font-bold text-white">TalkTuahTherapist</h1>
                        </Link>
                        
                        <div className="flex items-center gap-4">
                            <Dynamic />
                        </div>
                    </div>
                </nav>

                <main className="container mx-auto px-4 py-8 relative z-10">
                    <div className="max-w-3xl mx-auto space-y-8">
                        {!selectedPersona ? (
                            <motion.div 
                                className="flex flex-col items-center justify-center py-20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h2 className="text-5xl font-bold text-white mb-12 text-center gradient-text">
                                    Create Your Perfect Therapist
                                </h2>
                                <button 
                                    onClick={() => setShowCustomizer(true)}
                                    className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block"
                                >
                                    <span className="absolute inset-0 overflow-hidden rounded-full">
                                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    </span>
                                    <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-6 ring-1 ring-white/10">
                                        <FaPlus className="h-4 w-4" />
                                        <span className="text-sm">Create Custom Therapist</span>
                                    </div>
                                    <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                                </button>
                                
                                {personas.length > 0 && (
                                    <div className="mt-16 text-center">
                                        <p className="text-neutral-400 text-sm mb-8">Or choose from our preset therapists:</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {personas.map((persona) => (
                                                <motion.div
                                                    key={persona.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handlePersonaChange(persona.id)}
                                                    className="p-4 rounded-lg cursor-pointer bg-neutral-900/30 hover:bg-neutral-800/50 transition-all border border-transparent hover:border-white/30 group"
                                                >
                                                    <h3 className="font-medium text-base mb-1 text-neutral-400 group-hover:text-white transition-colors">{persona.name}</h3>
                                                    <p className="text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors">{persona.description}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="bg-neutral-800/50 backdrop-blur-md rounded-xl p-6 shadow-xl">
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
                                                <ChatMessage
                                                    content={message.content}
                                                    role={message.role}
                                                    onToggleMute={handleToggleMute}
                                                    isMuted={isMuted}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                
                                <SpeechRecorder
                                    selectedPersona={selectedPersona}
                                    messages={messages}
                                    setMessages={setMessages}
                                    isMuted={isMuted}
                                />
                            </div>
                        )}

                        <motion.div 
                            className="flex flex-wrap gap-4 justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            
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
                    </div>
                </main>

                {showCustomizer && (
                    <TherapistCustomizer
                        onSave={handleAddCustomTherapist}
                        onClose={() => setShowCustomizer(false)}
                    />
                )}

                <footer className="py-8 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <Image
                            src="/logo.png"
                            alt="TalkTuahTherapist"
                            width={30}
                            height={30}
                            className="rounded-full"
                            priority
                        />
                        <div className="text-neutral-400 fixed">
                            <p>© 2025 TalkTuahTherapist</p>
                        </div>
                    </motion.div>
                </footer>
            </motion.div>
        </div>
    );
}
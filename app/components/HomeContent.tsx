import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { motion, AnimatePresence } from "framer-motion";
import CustomPersonaCreator from "./CustomPersonaCreator";
import SpeechRecorder from "./SpeechRecorder";
import Dynamic from "./Dynamic";
import { basePersonas } from "../lib/constants";
import { Vortex } from "../components/ui/vortex";

export default function HomeContent() {
    const { primaryWallet } = useDynamicContext();
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [selectedPersona, setSelectedPersona] = useState(1);
    const [savedBlobIds, setSavedBlobIds] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [personas, setPersonas] = useState(basePersonas);
    const [searchQuery, setSearchQuery] = useState("");

    const handleAddCustomPersona = (newPersona: any) => {
        setPersonas(prev => [...prev, newPersona]);
    };

    const handleReset = () => setMessages([]);
    
    const handlePersonaChange = (newPersona: number) => {
        setSelectedPersona(newPersona);
        handleReset();
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
        <div className="min-h-screen relative overflow-hidden">
            <Vortex className="absolute inset-0" baseHue={220} particleCount={500} />
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10"
            >
                <div className="bg-primary-900/50 text-primary-200 py-3 text-center backdrop-blur-sm border-b border-primary-800/50">
                    <motion.p
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg font-medium"
                    >
                        Welcome to TalkTuahTherapist - Your AI Companion
                    </motion.p>
                </div>

                <nav className="p-6 flex justify-between items-center backdrop-blur-sm bg-primary-900/30 border-b border-primary-800/50">
                    <motion.div 
                        className="flex items-center gap-4"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
                            <Image
                                src="/raccoon-logo.png"
                                alt="TalkTuahTherapist Logo"
                                width={50}
                                height={50}
                                className="rounded-full relative"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">TalkTuahTherapist</h1>
                            <p className="text-sm text-neutral-300">AI Therapy Chat</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Dynamic />
                    </motion.div>
                </nav>

                <main className="container mx-auto px-4 py-8 relative z-10">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <motion.h2 
                            className="text-4xl font-bold text-white mb-6 text-center gradient-text"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            Choose Your Therapist
                        </motion.h2>

                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            {personas.map((persona, index) => (
                                <motion.div
                                    key={persona.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handlePersonaChange(persona.id)}
                                    className={`card-enhanced gradient-border p-6 rounded-xl cursor-pointer transition-all ${
                                        selectedPersona === persona.id
                                            ? 'bg-primary-900/70 ring-2 ring-primary-400 shadow-lg shadow-primary-500/20'
                                            : 'bg-neutral-800/30 hover:bg-primary-900/50'
                                    }`}
                                >
                                    <h3 className="font-semibold text-lg mb-2 text-white">{persona.name}</h3>
                                    <p className="text-sm text-neutral-400">{persona.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div 
                            className="bg-neutral-800/50 backdrop-blur-md rounded-xl p-6 shadow-xl border border-neutral-700/50"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
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
                                            } shadow-lg`}>
                                                {message.content}
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
                        </motion.div>

                        <motion.div 
                            className="flex flex-wrap gap-4 justify-center"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.2 }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleReset}
                                className="px-6 py-3 bg-neutral-700/50 hover:bg-neutral-600/50 text-white rounded-lg transition-all backdrop-blur-sm shadow-lg hover:shadow-xl"
                            >
                                Reset Chat
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-3 bg-primary-600/80 hover:bg-primary-700/80 text-white rounded-lg transition-all backdrop-blur-sm shadow-lg hover:shadow-xl disabled:bg-neutral-600/50"
                            >
                                {isSaving ? "Saving..." : "Save Chat"}
                            </motion.button>
                            {savedBlobIds[selectedPersona] && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLoad}
                                    disabled={isLoading}
                                    className="px-6 py-3 bg-primary-600/80 hover:bg-primary-700/80 text-white rounded-lg transition-all backdrop-blur-sm shadow-lg hover:shadow-xl disabled:bg-neutral-600/50"
                                >
                                    {isLoading ? "Loading..." : "Load Chat"}
                                </motion.button>
                            )}
                        </motion.div>

                        <CustomPersonaCreator onAdd={handleAddCustomPersona} />
                    </div>
                </main>

                <footer className="p-6 text-center text-neutral-400 relative z-10 backdrop-blur-sm border-t border-primary-800/50">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                    >
                        Made with 🥰 by{" "}
                        <Link 
                            href="https://www.linkedin.com/in/dev-katyal-67bb1623b/" 
                            className="text-primary-400 hover:text-primary-300 transition-all hover:underline"
                        >
                            UofT Hacks Team
                        </Link>
                    </motion.div>
                </footer>
            </motion.div>
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import Layout from "../components/Layout";
import SpeechRecorder from "../components/SpeechRecorder";

export default function ChatPage() {
    return (
        <DynamicContextProvider
            settings={{
                environmentId: "da43eec4-0253-4950-b5fe-741236182249",
                walletConnectors: [EthereumWalletConnectors],
            }}
        >
            <ChatContent />
        </DynamicContextProvider>
    );
}

function ChatContent() {
    const router = useRouter();
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);
    
    useEffect(() => {
        const therapist = localStorage.getItem('selectedTherapist');
        if (!therapist) {
            router.push('/');
        } else {
            setSelectedTherapist(Number(therapist));
        }
    }, [router]);
    
    return (
        <Layout>
            <div className="flex flex-col min-h-screen">
                <div className="flex-1 container mx-auto px-4 pb-20">
                    <motion.div 
                        className="max-w-3xl mx-auto w-full h-[calc(100vh-8rem)] flex flex-col"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div 
                            className="mb-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/therapist')}
                                className="group relative p-3 bg-gradient-to-r from-primary-600/80 to-primary-700/80 hover:from-primary-700/80 hover:to-primary-800/80 text-white rounded-lg transition-all backdrop-blur-sm shadow-lg hover:shadow-xl overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="relative z-10 text-xl">←</span>
                            </motion.button>
                        </motion.div>

                        <motion.div 
                            className="flex-1 overflow-y-auto space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <AnimatePresence mode="wait">
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                                    >
                                        <div className={`max-w-[80%] rounded-lg p-4 ${
                                            message.role === 'user' 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-700 text-gray-100'
                                        }`}>
                                            {message.content}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div 
                            className="mt-auto pt-4 bg-background"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <SpeechRecorder
                                selectedPersona={selectedTherapist}
                                messages={messages}
                                setMessages={setMessages}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
} 
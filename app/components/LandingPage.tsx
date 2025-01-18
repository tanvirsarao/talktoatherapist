"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Vortex } from "./ui/vortex";
import { FaBrain, FaLock, FaMicrophone, FaRobot, FaUserFriends, FaHeart, FaShieldAlt, FaComments, FaStar } from 'react-icons/fa';

export default function LandingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <Vortex className="absolute inset-0" baseHue={220} particleCount={300} />
            
            <div className="relative z-10">
                <nav className="p-6 backdrop-blur-sm bg-primary-900/30">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Image
                                    src="/logo.png"
                                    alt="TalkTuahTherapist Logo"
                                    width={50}
                                    height={50}
                                    className="rounded-full relative"
                                    priority
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-2xl font-bold text-white">TalkTuahTherapist</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-primary-300">Powered by AI</span>
                                    <div className="h-1 w-1 rounded-full bg-primary-400"></div>
                                    <span className="text-xs text-primary-300">24/7 Support</span>
                                </div>
                            </div>
                        </div>
                        <Link 
                            href="/therapist"
                            className="relative group px-6 py-3 bg-gradient-to-r from-primary-600/80 to-primary-700/80 hover:from-primary-700/80 hover:to-primary-800/80 text-white rounded-lg transition-all backdrop-blur-sm shadow-lg hover:shadow-xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative z-10">Start Session</span>
                        </Link>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto px-4">
                    <div className="py-20 text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative inline-block"
                        >
                        </motion.div>

                        <motion.h1 
                            className="text-7xl font-bold gradient-text tracking-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Your AI Companion for<br />Mental Wellness
                        </motion.h1>
                        
                        <motion.p 
                            className="text-xl text-neutral-300 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Experience personalized therapy sessions with our unique AI personas, 
                            designed to provide support and guidance in your mental health journey.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex justify-center gap-6"
                        >
                            <Link 
                                href="/therapist"
                                className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg transition-all transform hover:scale-105 hover:shadow-xl font-semibold text-lg overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Your Session
                                    <FaHeart className="group-hover:scale-110 transition-transform" />
                                </span>
                            </Link>
                        </motion.div>

                        <motion.div 
                            className="flex justify-center gap-8 mt-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex items-center gap-2">
                                <FaShieldAlt className="text-primary-400" />
                                <span className="text-sm text-neutral-300">Secure & Private</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaComments className="text-primary-400" />
                                <span className="text-sm text-neutral-300">24/7 Support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaStar className="text-primary-400" />
                                <span className="text-sm text-neutral-300">Personalized Care</span>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <div className="card-enhanced p-8 rounded-xl relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                            <FaBrain className="text-4xl text-primary-400 mb-4 relative z-10" />
                            <h3 className="text-xl font-semibold text-white mb-3 relative z-10">Personalized Experience</h3>
                            <p className="text-neutral-300 relative z-10">Choose from multiple unique therapist personas, each with their own approach and personality.</p>
                        </div>
                        <div className="card-enhanced p-8 rounded-xl relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                            <FaMicrophone className="text-4xl text-primary-400 mb-4 relative z-10" />
                            <h3 className="text-xl font-semibold text-white mb-3 relative z-10">Voice Interaction</h3>
                            <p className="text-neutral-300 relative z-10">Natural conversations through voice recognition for a more engaging therapeutic experience.</p>
                        </div>
                        <div className="card-enhanced p-8 rounded-xl relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                            <FaLock className="text-4xl text-primary-400 mb-4 relative z-10" />
                            <h3 className="text-xl font-semibold text-white mb-3 relative z-10">Secure & Private</h3>
                            <p className="text-neutral-300 relative z-10">Your conversations are encrypted and stored securely using blockchain technology.</p>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="py-20 border-t border-primary-800/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <h2 className="text-4xl font-bold text-center mb-16 gradient-text">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-400/20 to-transparent -translate-y-1/2 hidden md:block"></div>
                            <div className="text-center space-y-4 relative">
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full opacity-20 blur-sm"></div>
                                        <FaUserFriends className="text-5xl text-primary-400 relative" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Choose Your Therapist</h3>
                                <p className="text-neutral-300">Select from our diverse range of AI personas, each with unique therapeutic approaches.</p>
                            </div>
                            <div className="text-center space-y-4 relative">
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full opacity-20 blur-sm"></div>
                                        <FaMicrophone className="text-5xl text-primary-400 relative" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Start Talking</h3>
                                <p className="text-neutral-300">Use voice or text to communicate naturally with your AI therapist.</p>
                            </div>
                            <div className="text-center space-y-4 relative">
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full opacity-20 blur-sm"></div>
                                        <FaRobot className="text-5xl text-primary-400 relative" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Get Support</h3>
                                <p className="text-neutral-300">Receive personalized guidance and support in real-time.</p>
                            </div>
                        </div>
                    </motion.div>
                </main>

                <footer className="border-t border-primary-800/50 py-8 text-center">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col items-center gap-4">
                            <Image
                                src="/logo.png"
                                alt="TalkTuahTherapist"
                                width={40}
                                height={40}
                                className="rounded-full"
                                priority
                            />
                            <div className="text-neutral-400">
                                <p>© 2025 TalkTuahTherapist</p>
                                <div className="flex justify-center gap-4 mt-2 text-sm">
                                    <Link href="#" className="text-primary-400 hover:text-primary-300 transition-colors">Privacy Policy</Link>
                                    <Link href="#" className="text-primary-400 hover:text-primary-300 transition-colors">Terms of Service</Link>
                                    <Link href="#" className="text-primary-400 hover:text-primary-300 transition-colors">Contact</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
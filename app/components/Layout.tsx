"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Dynamic from "./Dynamic";
import { Vortex } from "./ui/vortex";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col">
            <Vortex className="absolute inset-0" baseHue={220} particleCount={500} />
            
            <nav className="relative z-20 backdrop-blur-sm bg-primary-900/30">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
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
                </div>
            </nav>

            <main className="flex-1 relative z-10">
                {children}
            </main>

            <footer className="py-8 text-center relative z-20">
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
                    <div className="text-neutral-400">
                        <p>© 2025 TalkTuahTherapist</p>
                    </div>
                </motion.div>
            </footer>
        </div>
    );
} 
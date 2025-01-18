import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLaughBeam, FaPray, FaHeart, FaBrain, FaMoneyBillWave, FaGraduationCap } from 'react-icons/fa';

interface TherapistCustomizerProps {
    onSave: (therapist: {
        name: string;
        description: string;
        customPrompt: string;
        traits: {
            humor: number;
            spirituality: number;
            expertise: string[];
            formality: number;
            empathy: number;
            directness: number;
        };
    }) => void;
    onClose: () => void;
}

const expertiseAreas = [
    "Relationships",
    "Anxiety",
    "Depression",
    "Career",
    "Personal Growth",
    "Trauma",
    "Addiction",
    "Stress Management",
    "Family Issues",
    "Self-Esteem"
];

export default function TherapistCustomizer({ onSave, onClose }: TherapistCustomizerProps) {
    const [name, setName] = useState('');
    const [traits, setTraits] = useState({
        humor: 50,
        spirituality: 50,
        expertise: [] as string[],
        formality: 50,
        empathy: 50,
        directness: 50
    });

    const generateCustomPrompt = () => {
        const humorLevel = traits.humor > 75 ? "very humorous" : traits.humor > 50 ? "occasionally humorous" : traits.humor > 25 ? "slightly humorous" : "serious";
        const spiritualityLevel = traits.spirituality > 75 ? "very spiritual" : traits.spirituality > 50 ? "moderately spiritual" : traits.spirituality > 25 ? "slightly spiritual" : "non-spiritual";
        const formalityLevel = traits.formality > 75 ? "very formal" : traits.formality > 50 ? "professional" : traits.formality > 25 ? "casual" : "very casual";
        const empathyLevel = traits.empathy > 75 ? "highly empathetic" : traits.empathy > 50 ? "empathetic" : traits.empathy > 25 ? "moderately empathetic" : "direct";
        const directnessLevel = traits.directness > 75 ? "very direct" : traits.directness > 50 ? "straightforward" : traits.directness > 25 ? "gentle" : "very gentle";

        return `You are a ${humorLevel}, ${spiritualityLevel}, ${formalityLevel}, ${empathyLevel}, and ${directnessLevel} therapist specializing in ${traits.expertise.join(", ")}. Your name is ${name}. Maintain this personality consistently throughout the conversation while providing professional therapeutic support.`;
    };

    const handleSave = () => {
        if (!name) {
            alert("Please provide a name for your therapist");
            return;
        }
        if (traits.expertise.length === 0) {
            alert("Please select at least one area of expertise");
            return;
        }

        const customPrompt = generateCustomPrompt();
        const description = `A ${traits.humor > 50 ? "humorous" : "serious"}, ${traits.spirituality > 50 ? "spiritual" : "practical"} therapist specializing in ${traits.expertise.slice(0, 2).join(" and ")}`;

        onSave({
            name,
            description,
            customPrompt,
            traits
        });
    };

    const toggleExpertise = (area: string) => {
        setTraits(prev => ({
            ...prev,
            expertise: prev.expertise.includes(area)
                ? prev.expertise.filter(e => e !== area)
                : [...prev.expertise, area]
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
            <div className="bg-neutral-800/90 backdrop-blur-md rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                <h2 className="text-2xl font-bold text-white mb-6">Customize Your Therapist</h2>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Therapist Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-neutral-700/50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-white"
                            placeholder="Dr. Smith"
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                                <FaLaughBeam /> Humor Level
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={traits.humor}
                                onChange={(e) => setTraits(prev => ({ ...prev, humor: parseInt(e.target.value) }))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-neutral-400">
                                <span>Serious</span>
                                <span>Humorous</span>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                                <FaPray /> Spirituality Level
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={traits.spirituality}
                                onChange={(e) => setTraits(prev => ({ ...prev, spirituality: parseInt(e.target.value) }))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-neutral-400">
                                <span>Practical</span>
                                <span>Spiritual</span>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                                <FaGraduationCap /> Formality Level
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={traits.formality}
                                onChange={(e) => setTraits(prev => ({ ...prev, formality: parseInt(e.target.value) }))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-neutral-400">
                                <span>Casual</span>
                                <span>Formal</span>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                                <FaHeart /> Empathy Level
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={traits.empathy}
                                onChange={(e) => setTraits(prev => ({ ...prev, empathy: parseInt(e.target.value) }))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-neutral-400">
                                <span>Direct</span>
                                <span>Empathetic</span>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                                <FaBrain /> Communication Style
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={traits.directness}
                                onChange={(e) => setTraits(prev => ({ ...prev, directness: parseInt(e.target.value) }))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-neutral-400">
                                <span>Gentle</span>
                                <span>Direct</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Areas of Expertise
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {expertiseAreas.map((area) => (
                                <button
                                    key={area}
                                    onClick={() => toggleExpertise(area)}
                                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                                        traits.expertise.includes(area)
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-600/50'
                                    }`}
                                >
                                    {area}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                        >
                            Create Therapist
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
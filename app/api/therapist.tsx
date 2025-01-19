import { useState } from 'react';
import { generateCustomPrompt } from '../components/TherapistCustomizer';

interface TherapistTraits {
  humor: number;
  spirituality: number;
  expertise: string[];
  formality: number;
  empathy: number;
  directness: number;
}

export default function TherapistPage() {
  const [therapistName, setTherapistName] = useState('');
  const [therapistTraits, setTherapistTraits] = useState<TherapistTraits>({
    humor: 50,
    spirituality: 50,
    expertise: ['Cognitive Behavioral Therapy'],
    formality: 50,
    empathy: 50,
    directness: 50,
  });
  const [customPrompt, setCustomPrompt] = useState('');

  const handleGeneratePrompt = () => {
    const generatedPrompt = generateCustomPrompt(
      therapistName,
      therapistTraits
    );
    setCustomPrompt(generatedPrompt);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Therapist Page</h1>

      <div className="mb-4">
        <label
          htmlFor="therapistName"
          className="block text-sm font-medium text-gray-700"
        >
          Therapist Name
        </label>
        <input
          type="text"
          id="therapistName"
          value={therapistName}
          onChange={(e) => setTherapistName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Therapist Traits</h2>
        {Object.entries(therapistTraits).map(
          ([trait, value]) =>
            trait !== 'expertise' && (
              <div key={trait} className="mb-2">
                <label
                  htmlFor={trait}
                  className="block text-sm font-medium text-gray-700 capitalize"
                >
                  {trait}
                </label>
                <input
                  type="range"
                  id={trait}
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) =>
                    setTherapistTraits((prev) => ({
                      ...prev,
                      [trait]: parseInt(e.target.value),
                    }))
                  }
                  className="mt-1 block w-full"
                />
              </div>
            )
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="expertise"
          className="block text-sm font-medium text-gray-700"
        >
          Expertise (comma-separated)
        </label>
        <input
          type="text"
          id="expertise"
          value={therapistTraits.expertise.join(', ')}
          onChange={(e) =>
            setTherapistTraits((prev) => ({
              ...prev,
              expertise: e.target.value.split(',').map((item) => item.trim()),
            }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <button
        onClick={handleGeneratePrompt}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Generate Custom Prompt
      </button>

      {customPrompt && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Custom Prompt:</h2>
          <p className="p-4 bg-gray-100 rounded-md">{customPrompt}</p>
        </div>
      )}
    </div>
  );
}

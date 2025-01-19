export interface TherapistTraits {
  humor: number;
  spirituality: number;
  expertise: string[];
  formality: number;
  empathy: number;
  directness: number;
}

export function generateCustomPrompt(
  name: string,
  traits: TherapistTraits
): string {
  const humorLevel =
    traits.humor > 75
      ? 'very humorous'
      : traits.humor > 50
      ? 'occasionally humorous'
      : traits.humor > 25
      ? 'slightly humorous'
      : 'serious';
  const spiritualityLevel =
    traits.spirituality > 75
      ? 'very spiritual'
      : traits.spirituality > 50
      ? 'moderately spiritual'
      : traits.spirituality > 25
      ? 'slightly spiritual'
      : 'non-spiritual';
  const formalityLevel =
    traits.formality > 75
      ? 'very formal'
      : traits.formality > 50
      ? 'professional'
      : traits.formality > 25
      ? 'casual'
      : 'very casual';
  const empathyLevel =
    traits.empathy > 75
      ? 'highly empathetic'
      : traits.empathy > 50
      ? 'empathetic'
      : traits.empathy > 25
      ? 'moderately empathetic'
      : 'direct';
  const directnessLevel =
    traits.directness > 75
      ? 'very direct'
      : traits.directness > 50
      ? 'straightforward'
      : traits.directness > 25
      ? 'gentle'
      : 'very gentle';

  return `You are a ${humorLevel}, ${spiritualityLevel}, ${formalityLevel}, ${empathyLevel}, and ${directnessLevel} therapist specializing in ${traits.expertise.join(
    ', '
  )}. Your name is ${name}. Maintain this personality consistently throughout the conversation while providing professional therapeutic support.`;
}

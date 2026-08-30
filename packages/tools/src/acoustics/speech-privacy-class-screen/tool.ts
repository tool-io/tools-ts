import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly averageBackgroundLevelDecibels: number;
  readonly averageLevelDifferenceDecibels: number;
  readonly targetSpeechPrivacyClass: number;
}>;
export type Output = Readonly<{
  readonly marginToTarget: number;
  readonly speechPrivacyPotential: number;
  readonly meetsCallerTarget: boolean;
}>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of Object.entries(input))
    if (!Number.isFinite(value))
      simpleError(field, "Values must be finite.", "invalid_value");
  const speechPrivacyPotential =
    input.averageLevelDifferenceDecibels + input.averageBackgroundLevelDecibels;
  const marginToTarget =
    speechPrivacyPotential - input.targetSpeechPrivacyClass;
  if (
    !Number.isFinite(speechPrivacyPotential) ||
    !Number.isFinite(marginToTarget)
  )
    simpleError(
      "averageLevelDifferenceDecibels",
      "Speech-privacy value or margin is out of range.",
      "numeric_overflow",
    );
  return {
    marginToTarget,
    speechPrivacyPotential,
    meetsCallerTarget: marginToTarget >= 0,
  };
};

export const example = {
  input: {
    averageBackgroundLevelDecibels: 35,
    averageLevelDifferenceDecibels: 45,
    targetSpeechPrivacyClass: 80,
  },
  output: {
    marginToTarget: 0,
    speechPrivacyPotential: 80,
    meetsCallerTarget: true,
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    averageBackgroundLevelDecibels: 30,
    averageLevelDifferenceDecibels: 40,
    targetSpeechPrivacyClass: 75,
  },
  output: {
    marginToTarget: -5,
    speechPrivacyPotential: 70,
    meetsCallerTarget: false,
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      averageBackgroundLevelDecibels:
        input.averageBackgroundLevelDecibels as number,
      averageLevelDifferenceDecibels:
        input.averageLevelDifferenceDecibels as number,
      targetSpeechPrivacyClass: input.targetSpeechPrivacyClass as number,
    }),
  description:
    "Add average level difference and average background level as the ASTM E2638 speech-privacy potential and compare it with an explicit target SPC.",
  id: "acoustics/speech-privacy-class-screen",
  inputs: [
    {
      id: "averageBackgroundLevelDecibels",
      kind: "number",
      label: "Average background level",
      unit: "dB",
    },
    {
      id: "averageLevelDifferenceDecibels",
      kind: "number",
      label: "Average level difference",
      unit: "dB",
    },
    {
      id: "targetSpeechPrivacyClass",
      kind: "number",
      label: "Caller target SPC",
    },
  ],
  outputs: [
    { id: "marginToTarget", kind: "number", label: "Margin to target" },
    {
      id: "speechPrivacyPotential",
      kind: "number",
      label: "Speech privacy potential",
    },
    { id: "meetsCallerTarget", kind: "boolean", label: "Meets caller target" },
  ],
  title: "Speech Privacy Class Screen",
});

export const run = tool.execute;
export default tool;

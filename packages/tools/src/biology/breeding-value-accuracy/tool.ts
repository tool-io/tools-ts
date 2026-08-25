import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type BreedingValueAccuracyInput = {
  readonly reliabilitySquared?: number;
};

export type BreedingValueAccuracyOutput = {
  readonly accuracyCorrelation: number;
};

export const breedingValueAccuracyExample = {
  input: { reliabilitySquared: 0.25 },
  output: { accuracyCorrelation: 0.5 },
} satisfies ToolExample<
  BreedingValueAccuracyInput,
  BreedingValueAccuracyOutput
>;

export const breedingValueAccuracyTool = createSimpleTool({
  id: "biology/breeding-value-accuracy",
  title: "EBV Accuracy",
  description:
    "Convert an estimated breeding value reliability into the accuracy correlation as the square root of the reliability.",
  inputs: [
    {
      default: 0.5,
      description: "Reliability of the breeding value estimate.",
      id: "reliabilitySquared",
      label: "Reliability",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "accuracyCorrelation",
      label: "Accuracy correlation",
      kind: "number",
    },
  ],
  calculate: (input) => ({
    accuracyCorrelation: Math.sqrt(input.reliabilitySquared as number),
  }),
});
export const runBreedingValueAccuracy = breedingValueAccuracyTool.execute;
export default breedingValueAccuracyTool;

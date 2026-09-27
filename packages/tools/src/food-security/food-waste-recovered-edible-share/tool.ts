import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectedMass: number;
  readonly edibleFraction: number;
  readonly recoveryFraction: number;
};
export type Output = {
  readonly edibleMass: number;
  readonly recoveredEdibleMass: number;
  readonly shareOfCollected: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedMass: { type: "number", minimum: 0 },
    edibleFraction: { type: "number", minimum: 0, maximum: 1 },
    recoveryFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["collectedMass", "edibleFraction", "recoveryFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edibleMass: { type: "number" },
    recoveredEdibleMass: { type: "number" },
    shareOfCollected: { type: "number" },
  },
  required: ["edibleMass", "recoveredEdibleMass", "shareOfCollected"],
} as const;
/** Calculate food waste recovered edible share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectedMass, edibleFraction, recoveryFraction } = request;
  const compute = (): Output => {
    H.domain(collectedMass >= 0);
    H.probability(edibleFraction);
    H.probability(recoveryFraction);
    return {
      edibleMass: collectedMass * edibleFraction,
      recoveredEdibleMass: collectedMass * edibleFraction * recoveryFraction,
      shareOfCollected: edibleFraction * recoveryFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectedMass: 100, edibleFraction: 0.8, recoveryFraction: 0.5 },
  output: { edibleMass: 80, recoveredEdibleMass: 40, shareOfCollected: 0.4 },
} satisfies ToolExample<Input, Output>;
export const foodWasteRecoveredEdibleShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/food-waste-recovered-edible-share",
    title: "Food Waste Recovered Edible Share Tool",
    description:
      "Calculate food waste recovered edible share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectedMass: { type: "number", minimum: 0 },
        edibleFraction: { type: "number", minimum: 0, maximum: 1 },
        recoveryFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["collectedMass", "edibleFraction", "recoveryFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edibleMass: { type: "number" },
        recoveredEdibleMass: { type: "number" },
        shareOfCollected: { type: "number" },
      },
      required: ["edibleMass", "recoveredEdibleMass", "shareOfCollected"],
    },
    ports: {
      inputs: [
        {
          id: "collectedMass",
          label: "Collected Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "edibleFraction",
          label: "Edible Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "recoveryFraction",
          label: "Recovery Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "edibleMass",
          label: "Edible Mass",
          valueType: { type: "number" },
        },
        {
          id: "recoveredEdibleMass",
          label: "Recovered Edible Mass",
          valueType: { type: "number" },
        },
        {
          id: "shareOfCollected",
          label: "Share Of Collected",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodWasteRecoveredEdibleShareTool.execute;
export default foodWasteRecoveredEdibleShareTool;

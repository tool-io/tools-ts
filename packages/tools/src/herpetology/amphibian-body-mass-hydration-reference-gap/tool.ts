import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedMass: number;
  readonly referenceMass: number;
  readonly waterLossMass: number;
};
export type Output = {
  readonly correctedMass: number;
  readonly observedGap: number;
  readonly correctedGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedMass: { type: "number", minimum: 0 },
    referenceMass: { type: "number", minimum: 0 },
    waterLossMass: { type: "number", minimum: 0 },
  },
  required: ["observedMass", "referenceMass", "waterLossMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedMass: { type: "number" },
    observedGap: { type: "number" },
    correctedGap: { type: "number" },
  },
  required: ["correctedMass", "observedGap", "correctedGap"],
} as const;
/** Explicit measured water-loss addback relative to a supplied reference mass, without inferring hydration status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedMass, referenceMass, waterLossMass } = request;
  const compute = (): Output => {
    H.domain(observedMass >= 0 && referenceMass >= 0 && waterLossMass >= 0);
    return {
      correctedMass: observedMass + waterLossMass,
      observedGap: observedMass - referenceMass,
      correctedGap: observedMass + waterLossMass - referenceMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedMass: 9, referenceMass: 10, waterLossMass: 0.5 },
  output: { correctedMass: 9.5, observedGap: -1, correctedGap: -0.5 },
} satisfies ToolExample<Input, Output>;
export const amphibianBodyMassHydrationReferenceGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "herpetology/amphibian-body-mass-hydration-reference-gap",
      title: "Amphibian Body Mass Hydration Reference Gap Tool",
      description:
        "Explicit measured water-loss addback relative to a supplied reference mass, without inferring hydration status.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedMass: { type: "number", minimum: 0 },
          referenceMass: { type: "number", minimum: 0 },
          waterLossMass: { type: "number", minimum: 0 },
        },
        required: ["observedMass", "referenceMass", "waterLossMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correctedMass: { type: "number" },
          observedGap: { type: "number" },
          correctedGap: { type: "number" },
        },
        required: ["correctedMass", "observedGap", "correctedGap"],
      },
      ports: {
        inputs: [
          {
            id: "observedMass",
            label: "Observed Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceMass",
            label: "Reference Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "waterLossMass",
            label: "Water Loss Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "correctedMass",
            label: "Corrected Mass",
            valueType: { type: "number" },
          },
          {
            id: "observedGap",
            label: "Observed Gap",
            valueType: { type: "number" },
          },
          {
            id: "correctedGap",
            label: "Corrected Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = amphibianBodyMassHydrationReferenceGapTool.execute;
export default amphibianBodyMassHydrationReferenceGapTool;

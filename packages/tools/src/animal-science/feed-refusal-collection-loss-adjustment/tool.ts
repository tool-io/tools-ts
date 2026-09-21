import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly offeredMass: number;
  readonly recoveredRefusal: number;
  readonly recoveryFraction: number;
};
export type Output = {
  readonly estimatedRefusal: number;
  readonly estimatedIntake: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offeredMass: { type: "number", minimum: 0 },
    recoveredRefusal: { type: "number", minimum: 0 },
    recoveryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["offeredMass", "recoveredRefusal", "recoveryFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimatedRefusal: { type: "number" },
    estimatedIntake: { type: "number" },
  },
  required: ["estimatedRefusal", "estimatedIntake"],
} as const;
/** Signed intake estimate retains inconsistencies when corrected refusal exceeds offered feed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { offeredMass, recoveredRefusal, recoveryFraction } = request;
  const compute = (): Output => {
    H.domain(
      offeredMass >= 0 &&
        recoveredRefusal >= 0 &&
        recoveryFraction > 0 &&
        recoveryFraction <= 1,
    );
    return {
      estimatedRefusal: recoveredRefusal / recoveryFraction,
      estimatedIntake: offeredMass - recoveredRefusal / recoveryFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { offeredMass: 100, recoveredRefusal: 8, recoveryFraction: 0.8 },
  output: { estimatedRefusal: 10, estimatedIntake: 90 },
} satisfies ToolExample<Input, Output>;
export const feedRefusalCollectionLossAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "animal-science/feed-refusal-collection-loss-adjustment",
      title: "Feed Refusal Collection Loss Adjustment Tool",
      description:
        "Signed intake estimate retains inconsistencies when corrected refusal exceeds offered feed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          offeredMass: { type: "number", minimum: 0 },
          recoveredRefusal: { type: "number", minimum: 0 },
          recoveryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        },
        required: ["offeredMass", "recoveredRefusal", "recoveryFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          estimatedRefusal: { type: "number" },
          estimatedIntake: { type: "number" },
        },
        required: ["estimatedRefusal", "estimatedIntake"],
      },
      ports: {
        inputs: [
          {
            id: "offeredMass",
            label: "Offered Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recoveredRefusal",
            label: "Recovered Refusal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recoveryFraction",
            label: "Recovery Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "estimatedRefusal",
            label: "Estimated Refusal",
            valueType: { type: "number" },
          },
          {
            id: "estimatedIntake",
            label: "Estimated Intake",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = feedRefusalCollectionLossAdjustmentTool.execute;
export default feedRefusalCollectionLossAdjustmentTool;

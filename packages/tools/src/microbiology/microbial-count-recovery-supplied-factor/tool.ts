import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedCount: number;
  readonly backgroundCount: number;
  readonly recoveryFraction: number;
  readonly originalVolume: number;
};
export type Output = {
  readonly correctedCount: number;
  readonly recoveryAdjusted: number;
  readonly perVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedCount: { type: "number", minimum: 0 },
    backgroundCount: { type: "number", minimum: 0 },
    recoveryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    originalVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "observedCount",
    "backgroundCount",
    "recoveryFraction",
    "originalVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedCount: { type: "number" },
    recoveryAdjusted: { type: "number" },
    perVolume: { type: "number" },
  },
  required: ["correctedCount", "recoveryAdjusted", "perVolume"],
} as const;
/** Explicit independently calibrated recovery correction on observed benign-sample counts, without selecting a recovery method. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedCount, backgroundCount, recoveryFraction, originalVolume } =
    request;
  const compute = (): Output => {
    H.domain(
      observedCount >= 0 &&
        backgroundCount >= 0 &&
        recoveryFraction > 0 &&
        recoveryFraction <= 1,
    );
    H.positive(originalVolume);
    return {
      correctedCount: observedCount - backgroundCount,
      recoveryAdjusted: (observedCount - backgroundCount) / recoveryFraction,
      perVolume:
        (observedCount - backgroundCount) / (recoveryFraction * originalVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedCount: 100,
    backgroundCount: 10,
    recoveryFraction: 0.5,
    originalVolume: 2,
  },
  output: { correctedCount: 90, recoveryAdjusted: 180, perVolume: 90 },
} satisfies ToolExample<Input, Output>;
export const microbialCountRecoverySuppliedFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "microbiology/microbial-count-recovery-supplied-factor",
      title: "Microbial Count Recovery Supplied Factor Tool",
      description:
        "Explicit independently calibrated recovery correction on observed benign-sample counts, without selecting a recovery method.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedCount: { type: "number", minimum: 0 },
          backgroundCount: { type: "number", minimum: 0 },
          recoveryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
          originalVolume: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "observedCount",
          "backgroundCount",
          "recoveryFraction",
          "originalVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correctedCount: { type: "number" },
          recoveryAdjusted: { type: "number" },
          perVolume: { type: "number" },
        },
        required: ["correctedCount", "recoveryAdjusted", "perVolume"],
      },
      ports: {
        inputs: [
          {
            id: "observedCount",
            label: "Observed Count",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "backgroundCount",
            label: "Background Count",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recoveryFraction",
            label: "Recovery Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "originalVolume",
            label: "Original Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "correctedCount",
            label: "Corrected Count",
            valueType: { type: "number" },
          },
          {
            id: "recoveryAdjusted",
            label: "Recovery Adjusted",
            valueType: { type: "number" },
          },
          {
            id: "perVolume",
            label: "Per Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = microbialCountRecoverySuppliedFactorTool.execute;
export default microbialCountRecoverySuppliedFactorTool;

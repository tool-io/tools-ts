import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly compressionSeconds: number;
  readonly trainingCycleSeconds: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compressionSeconds: { type: "number", minimum: 0 },
    trainingCycleSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["compressionSeconds", "trainingCycleSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate an explicitly measured compression-time fraction and noncompression time in a positive training cycle without resuscitation guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { compressionSeconds, trainingCycleSeconds } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(trainingCycleSeconds) && trainingCycleSeconds > 0,
      "trainingCycleSeconds",
    ),
      trainingCycleSeconds);
    H.domain(
      compressionSeconds >= 0 && compressionSeconds <= trainingCycleSeconds,
      "compressionSeconds",
    );
    return {
      fraction: compressionSeconds / trainingCycleSeconds,
      remainder: trainingCycleSeconds - compressionSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { compressionSeconds: 30, trainingCycleSeconds: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const resuscitationTrainingCompressionDutyFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "emergency-medicine/resuscitation-training-compression-duty-fraction",
      title: "Resuscitation Training Compression Duty Fraction Tool",
      description:
        "Calculate an explicitly measured compression-time fraction and noncompression time in a positive training cycle without resuscitation guidance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          compressionSeconds: { type: "number", minimum: 0 },
          trainingCycleSeconds: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["compressionSeconds", "trainingCycleSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fraction: { type: "number" },
          remainder: { type: "number" },
        },
        required: ["fraction", "remainder"],
      },
      ports: {
        inputs: [
          {
            id: "compressionSeconds",
            label: "Compression Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "trainingCycleSeconds",
            label: "Training Cycle Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "remainder",
            label: "Remainder",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = resuscitationTrainingCompressionDutyFractionTool.execute;
export default resuscitationTrainingCompressionDutyFractionTool;

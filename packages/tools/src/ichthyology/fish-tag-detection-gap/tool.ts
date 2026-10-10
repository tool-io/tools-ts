import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousDetectionSeconds: number;
  readonly nextDetectionSeconds: number;
};
export type Output = { readonly gapSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousDetectionSeconds: { type: "number" },
    nextDetectionSeconds: { type: "number" },
  },
  required: ["previousDetectionSeconds", "nextDetectionSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gapSeconds: { type: "number" } },
  required: ["gapSeconds"],
} as const;
/** Subtract explicitly recorded ordered fish-tag detection times without estimating movement between detections. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousDetectionSeconds, nextDetectionSeconds } = request;
  const compute = (): Output => {
    H.domain(
      nextDetectionSeconds >= previousDetectionSeconds,
      "nextDetectionSeconds",
    );
    return { gapSeconds: nextDetectionSeconds - previousDetectionSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousDetectionSeconds: 120, nextDetectionSeconds: 195 },
  output: { gapSeconds: 75 },
} satisfies ToolExample<Input, Output>;
export const fishTagDetectionGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["ichthyology", "biology"],
        keywords: ["ichthyology", "biology"],
      },
      id: "ichthyology/fish-tag-detection-gap",
      title: "Fish Tag Detection Gap",
      description:
        "Subtract explicitly recorded ordered fish-tag detection times without estimating movement between detections.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          previousDetectionSeconds: { type: "number" },
          nextDetectionSeconds: { type: "number" },
        },
        required: ["previousDetectionSeconds", "nextDetectionSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { gapSeconds: { type: "number" } },
        required: ["gapSeconds"],
      },
      ports: {
        inputs: [
          {
            id: "previousDetectionSeconds",
            label: "Previous Detection Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nextDetectionSeconds",
            label: "Next Detection Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "gapSeconds",
            label: "Gap Seconds",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = fishTagDetectionGapTool.execute;
export default fishTagDetectionGapTool;

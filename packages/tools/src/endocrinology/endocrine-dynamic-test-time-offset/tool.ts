import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleTimestampSeconds: number;
  readonly referenceTimestampSeconds: number;
};
export type Output = { readonly offsetSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleTimestampSeconds: { type: "number" },
    referenceTimestampSeconds: { type: "number" },
  },
  required: ["sampleTimestampSeconds", "referenceTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offsetSeconds: { type: "number" } },
  required: ["offsetSeconds"],
} as const;
/** Reference an explicitly recorded endocrine sample time to a supplied test time zero without specifying or interpreting a dynamic test. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleTimestampSeconds, referenceTimestampSeconds } = request;
  const compute = (): Output => {
    return {
      offsetSeconds: sampleTimestampSeconds - referenceTimestampSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleTimestampSeconds: 1600, referenceTimestampSeconds: 1000 },
  output: { offsetSeconds: 600 },
} satisfies ToolExample<Input, Output>;
export const endocrineDynamicTestTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["endocrinology", "health and medicine"],
      keywords: ["endocrinology", "health and medicine"],
    },
    id: "endocrinology/endocrine-dynamic-test-time-offset",
    title: "Endocrine Dynamic Test Time Offset",
    description:
      "Reference an explicitly recorded endocrine sample time to a supplied test time zero without specifying or interpreting a dynamic test.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleTimestampSeconds: { type: "number" },
        referenceTimestampSeconds: { type: "number" },
      },
      required: ["sampleTimestampSeconds", "referenceTimestampSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offsetSeconds: { type: "number" } },
      required: ["offsetSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "sampleTimestampSeconds",
          label: "Sample Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceTimestampSeconds",
          label: "Reference Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "offsetSeconds",
          label: "Offset Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = endocrineDynamicTestTimeOffsetTool.execute;
export default endocrineDynamicTestTimeOffsetTool;

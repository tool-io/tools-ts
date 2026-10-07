import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleTimeSeconds: number;
  readonly strideStartSeconds: number;
  readonly strideEndSeconds: number;
};
export type Output = { readonly stridePercent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleTimeSeconds: { type: "number" },
    strideStartSeconds: { type: "number" },
    strideEndSeconds: { type: "number" },
  },
  required: ["sampleTimeSeconds", "strideStartSeconds", "strideEndSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stridePercent: { type: "number" } },
  required: ["stridePercent"],
} as const;
/** Normalize one sample time to an explicitly bounded stride interval, including both 0% and 100% endpoints. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleTimeSeconds, strideStartSeconds, strideEndSeconds } = request;
  const compute = (): Output => {
    H.domain(
      strideEndSeconds > strideStartSeconds &&
        sampleTimeSeconds >= strideStartSeconds &&
        sampleTimeSeconds <= strideEndSeconds,
      "strideEndSeconds",
    );
    return {
      stridePercent:
        (100 * (sampleTimeSeconds - strideStartSeconds)) /
        (strideEndSeconds - strideStartSeconds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleTimeSeconds: 1.25,
    strideStartSeconds: 1,
    strideEndSeconds: 2,
  },
  output: { stridePercent: 25 },
} satisfies ToolExample<Input, Output>;
export const strideNormalizedTimePercentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomechanics", "engineering"],
      keywords: ["biomechanics", "engineering"],
    },
    id: "biomechanics/stride-normalized-time-percent",
    title: "Stride Normalized Time Percent",
    description:
      "Normalize one sample time to an explicitly bounded stride interval, including both 0% and 100% endpoints.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleTimeSeconds: { type: "number" },
        strideStartSeconds: { type: "number" },
        strideEndSeconds: { type: "number" },
      },
      required: ["sampleTimeSeconds", "strideStartSeconds", "strideEndSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { stridePercent: { type: "number" } },
      required: ["stridePercent"],
    },
    ports: {
      inputs: [
        {
          id: "sampleTimeSeconds",
          label: "Sample Time Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "strideStartSeconds",
          label: "Stride Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "strideEndSeconds",
          label: "Stride End Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stridePercent",
          label: "Stride Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = strideNormalizedTimePercentTool.execute;
export default strideNormalizedTimePercentTool;

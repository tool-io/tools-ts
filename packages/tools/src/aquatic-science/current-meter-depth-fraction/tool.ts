import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly meterDepth: number;
  readonly waterDepth: number;
};
export type Output = { readonly depthFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meterDepth: { type: "number", minimum: 0 },
    waterDepth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["meterDepth", "waterDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depthFraction: { type: "number" } },
  required: ["depthFraction"],
} as const;
/** Express supplied current-meter depth as a fraction of positive water-column depth from a shared surface datum. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { meterDepth, waterDepth } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(waterDepth) && waterDepth > 0, "waterDepth"),
      waterDepth);
    H.domain(meterDepth >= 0 && meterDepth <= waterDepth, "meterDepth");
    return { depthFraction: meterDepth / waterDepth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { meterDepth: 3, waterDepth: 12 },
  output: { depthFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const currentMeterDepthFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "aquatic-science",
        "aquatic science",
        "earth and environmental sciences",
      ],
      keywords: ["aquatic science", "earth and environmental sciences"],
    },
    id: "aquatic-science/current-meter-depth-fraction",
    title: "Current Meter Depth Fraction",
    description:
      "Express supplied current-meter depth as a fraction of positive water-column depth from a shared surface datum.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meterDepth: { type: "number", minimum: 0 },
        waterDepth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["meterDepth", "waterDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { depthFraction: { type: "number" } },
      required: ["depthFraction"],
    },
    ports: {
      inputs: [
        {
          id: "meterDepth",
          label: "Meter Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterDepth",
          label: "Water Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "depthFraction",
          label: "Depth Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = currentMeterDepthFractionTool.execute;
export default currentMeterDepthFractionTool;

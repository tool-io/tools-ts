import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalLength: number;
  readonly measuredLength: number;
};
export type Output = {
  readonly retainedLengthFraction: number;
  readonly shrinkageFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalLength: { type: "number", exclusiveMinimum: 0 },
    measuredLength: { type: "number", minimum: 0 },
  },
  required: ["originalLength", "measuredLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedLengthFraction: { type: "number" },
    shrinkageFraction: { type: "number" },
  },
  required: ["retainedLengthFraction", "shrinkageFraction"],
} as const;
/** Compare explicit original and measured lengths on one axis, preserving expansion as negative shrinkage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalLength, measuredLength } = request;
  const compute = (): Output => {
    (H.domain(originalLength > 0, "originalLength"), originalLength);
    H.domain(measuredLength >= 0, "measuredLength");
    return {
      retainedLengthFraction: measuredLength / originalLength,
      shrinkageFraction: 1 - measuredLength / originalLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalLength: 20, measuredLength: 18 },
  output: {
    retainedLengthFraction: 0.9,
    shrinkageFraction: 0.09999999999999998,
  },
} satisfies ToolExample<Input, Output>;
export const scaffoldAxisShrinkageRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biofabrication", "engineering"],
      keywords: ["biofabrication", "engineering"],
    },
    id: "biofabrication/scaffold-axis-shrinkage-ratio",
    title: "Scaffold Axis Shrinkage Ratio",
    description:
      "Compare explicit original and measured lengths on one axis, preserving expansion as negative shrinkage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalLength: { type: "number", exclusiveMinimum: 0 },
        measuredLength: { type: "number", minimum: 0 },
      },
      required: ["originalLength", "measuredLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedLengthFraction: { type: "number" },
        shrinkageFraction: { type: "number" },
      },
      required: ["retainedLengthFraction", "shrinkageFraction"],
    },
    ports: {
      inputs: [
        {
          id: "originalLength",
          label: "Original Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredLength",
          label: "Measured Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retainedLengthFraction",
          label: "Retained Length Fraction",
          valueType: { type: "number" },
        },
        {
          id: "shrinkageFraction",
          label: "Shrinkage Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scaffoldAxisShrinkageRatioTool.execute;
export default scaffoldAxisShrinkageRatioTool;

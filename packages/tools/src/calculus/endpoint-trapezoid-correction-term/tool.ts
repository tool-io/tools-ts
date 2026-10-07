import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intervalWidth: number;
  readonly leftValue: number;
  readonly rightValue: number;
};
export type Output = { readonly correctionToLeftRectangle: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intervalWidth: { type: "number" },
    leftValue: { type: "number" },
    rightValue: { type: "number" },
  },
  required: ["intervalWidth", "leftValue", "rightValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctionToLeftRectangle: { type: "number" } },
  required: ["correctionToLeftRectangle"],
} as const;
/** Compute the explicit endpoint trapezoid correction relative to a left rectangle on an oriented interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intervalWidth, leftValue, rightValue } = request;
  const compute = (): Output => {
    return {
      correctionToLeftRectangle: intervalWidth * ((rightValue - leftValue) / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intervalWidth: 2, leftValue: 3, rightValue: 5 },
  output: { correctionToLeftRectangle: 2 },
} satisfies ToolExample<Input, Output>;
export const endpointTrapezoidCorrectionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["calculus", "mathematics"],
      keywords: ["calculus", "mathematics"],
    },
    id: "calculus/endpoint-trapezoid-correction-term",
    title: "Endpoint Trapezoid Correction Term",
    description:
      "Compute the explicit endpoint trapezoid correction relative to a left rectangle on an oriented interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intervalWidth: { type: "number" },
        leftValue: { type: "number" },
        rightValue: { type: "number" },
      },
      required: ["intervalWidth", "leftValue", "rightValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctionToLeftRectangle: { type: "number" } },
      required: ["correctionToLeftRectangle"],
    },
    ports: {
      inputs: [
        {
          id: "intervalWidth",
          label: "Interval Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftValue",
          label: "Left Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightValue",
          label: "Right Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctionToLeftRectangle",
          label: "Correction To Left Rectangle",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = endpointTrapezoidCorrectionTermTool.execute;
export default endpointTrapezoidCorrectionTermTool;

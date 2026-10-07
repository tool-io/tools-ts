import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intervalWidth: number;
  readonly leftValue: number;
  readonly suppliedIntegral: number;
};
export type Output = {
  readonly leftRectangle: number;
  readonly integralMinusRectangle: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intervalWidth: { type: "number" },
    leftValue: { type: "number" },
    suppliedIntegral: { type: "number" },
  },
  required: ["intervalWidth", "leftValue", "suppliedIntegral"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftRectangle: { type: "number" },
    integralMinusRectangle: { type: "number" },
  },
  required: ["leftRectangle", "integralMinusRectangle"],
} as const;
/** Compare an explicit oriented left-rectangle area with a supplied integral on the same units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intervalWidth, leftValue, suppliedIntegral } = request;
  const compute = (): Output => {
    return {
      leftRectangle: intervalWidth * leftValue,
      integralMinusRectangle: suppliedIntegral - intervalWidth * leftValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intervalWidth: 2, leftValue: 3, suppliedIntegral: 8 },
  output: { leftRectangle: 6, integralMinusRectangle: 2 },
} satisfies ToolExample<Input, Output>;
export const localIntegralRectangleCorrectionTool = H.defineSchemaCalculation<
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
    id: "calculus/local-integral-rectangle-correction",
    title: "Local Integral Rectangle Correction",
    description:
      "Compare an explicit oriented left-rectangle area with a supplied integral on the same units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intervalWidth: { type: "number" },
        leftValue: { type: "number" },
        suppliedIntegral: { type: "number" },
      },
      required: ["intervalWidth", "leftValue", "suppliedIntegral"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftRectangle: { type: "number" },
        integralMinusRectangle: { type: "number" },
      },
      required: ["leftRectangle", "integralMinusRectangle"],
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
          id: "suppliedIntegral",
          label: "Supplied Integral",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "leftRectangle",
          label: "Left Rectangle",
          valueType: { type: "number" },
        },
        {
          id: "integralMinusRectangle",
          label: "Integral Minus Rectangle",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = localIntegralRectangleCorrectionTool.execute;
export default localIntegralRectangleCorrectionTool;

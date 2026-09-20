import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly slope: number;
  readonly bias: number;
};
export type Output = {
  readonly inflectionX: number;
  readonly signedDistance: number;
  readonly argumentDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    slope: { type: "number" },
    bias: { type: "number" },
  },
  required: ["x", "slope", "bias"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inflectionX: { type: "number" },
    signedDistance: { type: "number" },
    argumentDistance: { type: "number" },
  },
  required: ["inflectionX", "signedDistance", "argumentDistance"],
} as const;
/** Locate the unique inflection of tanh(slope*x+bias) under a nonzero supplied slope. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, slope, bias } = request;
  const compute = (): Output => {
    H.domain(slope !== 0);
    return {
      inflectionX: -bias / slope,
      signedDistance: x + bias / slope,
      argumentDistance: Math.abs(slope) * Math.abs(x + bias / slope),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 3, slope: 2, bias: -4 },
  output: { inflectionX: 2, signedDistance: 1, argumentDistance: 2 },
} satisfies ToolExample<Input, Output>;
export const tanhInflectionDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/tanh-inflection-distance",
    title: "Tanh Inflection Distance Tool",
    description:
      "Locate the unique inflection of tanh(slope*x+bias) under a nonzero supplied slope.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        slope: { type: "number" },
        bias: { type: "number" },
      },
      required: ["x", "slope", "bias"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inflectionX: { type: "number" },
        signedDistance: { type: "number" },
        argumentDistance: { type: "number" },
      },
      required: ["inflectionX", "signedDistance", "argumentDistance"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bias",
          label: "Bias",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "inflectionX",
          label: "Inflection X",
          valueType: { type: "number" },
        },
        {
          id: "signedDistance",
          label: "Signed Distance",
          valueType: { type: "number" },
        },
        {
          id: "argumentDistance",
          label: "Argument Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tanhInflectionDistanceTool.execute;
export default tanhInflectionDistanceTool;

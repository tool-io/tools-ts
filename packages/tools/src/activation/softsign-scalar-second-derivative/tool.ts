import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number; readonly zeroSide: string };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    zeroSide: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "reject"],
    },
  },
  required: ["x", "zeroSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Evaluate the softsign second derivative with an explicit one-sided convention at its nondifferentiable second-derivative boundary. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x, zeroSide } = input;
  const compute = (): Output => {
    H.domain(["left", "right", "reject"].includes(zeroSide));
    H.domain(x !== 0 || zeroSide !== "reject");
    return {
      derivative:
        x === 0
          ? zeroSide === "left"
            ? 2
            : -2
          : (-2 * Math.sign(x)) / (1 + Math.abs(x)) ** 3,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 1, zeroSide: "reject" },
  output: { derivative: -0.25 },
} satisfies ToolExample<Input, Output>;
export const softsignScalarSecondDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/softsign-scalar-second-derivative",
    title: "Softsign Scalar Second Derivative Tool",
    description:
      "Evaluate the softsign second derivative with an explicit one-sided convention at its nondifferentiable second-derivative boundary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        zeroSide: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "reject"],
        },
      },
      required: ["x", "zeroSide"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { derivative: { type: "number" } },
      required: ["derivative"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        {
          id: "zeroSide",
          label: "Zero Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = softsignScalarSecondDerivativeTool.execute;
export default softsignScalarSecondDerivativeTool;

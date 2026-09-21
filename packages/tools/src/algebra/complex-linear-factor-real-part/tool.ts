import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rootReal: number;
  readonly rootImaginary: number;
};
export type Output = {
  readonly linearCoefficient: number;
  readonly constant: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rootReal: { type: "number" },
    rootImaginary: { type: "number" },
  },
  required: ["rootReal", "rootImaginary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linearCoefficient: { type: "number" },
    constant: { type: "number" },
  },
  required: ["linearCoefficient", "constant"],
} as const;
/** Form the real quadratic from a complex root and its conjugate. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { rootReal, rootImaginary } = input;
  const compute = (): Output => {
    return {
      linearCoefficient: -2 * rootReal,
      constant: rootReal ** 2 + rootImaginary ** 2,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { rootReal: 2, rootImaginary: 3 },
  output: { linearCoefficient: -4, constant: 13 },
} satisfies ToolExample<Input, Output>;
export const complexLinearFactorRealPartTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/complex-linear-factor-real-part",
    title: "Complex Linear Factor Real Part Tool",
    description:
      "Form the real quadratic from a complex root and its conjugate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rootReal: { type: "number" },
        rootImaginary: { type: "number" },
      },
      required: ["rootReal", "rootImaginary"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linearCoefficient: { type: "number" },
        constant: { type: "number" },
      },
      required: ["linearCoefficient", "constant"],
    },
    ports: {
      inputs: [
        {
          id: "rootReal",
          label: "Root Real",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rootImaginary",
          label: "Root Imaginary",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "linearCoefficient",
          label: "Linear Coefficient",
          valueType: { type: "number" },
        },
        { id: "constant", label: "Constant", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = complexLinearFactorRealPartTool.execute;
export default complexLinearFactorRealPartTool;

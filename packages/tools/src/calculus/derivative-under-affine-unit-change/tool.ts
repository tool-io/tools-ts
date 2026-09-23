import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly derivative: number;
  readonly inputScale: number;
  readonly outputScale: number;
};
export type Output = { readonly transformed: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    derivative: { type: "number" },
    inputScale: { type: "number" },
    outputScale: { type: "number" },
  },
  required: ["derivative", "inputScale", "outputScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { transformed: { type: "number" } },
  required: ["transformed"],
} as const;
/** Calculate derivative under affine unit change from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { derivative, inputScale, outputScale } = input;
  const compute = (): Output => {
    H.domain(inputScale !== 0);
    return { transformed: (derivative * outputScale) / inputScale };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { derivative: 3, inputScale: 2, outputScale: 4 },
  output: { transformed: 6 },
} satisfies ToolExample<Input, Output>;
export const derivativeUnderAffineUnitChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/derivative-under-affine-unit-change",
    title: "Derivative Under Affine Unit Change Tool",
    description:
      "Calculate derivative under affine unit change from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        derivative: { type: "number" },
        inputScale: { type: "number" },
        outputScale: { type: "number" },
      },
      required: ["derivative", "inputScale", "outputScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { transformed: { type: "number" } },
      required: ["transformed"],
    },
    ports: {
      inputs: [
        {
          id: "derivative",
          label: "Derivative",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputScale",
          label: "Input Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outputScale",
          label: "Output Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "transformed",
          label: "Transformed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = derivativeUnderAffineUnitChangeTool.execute;
export default derivativeUnderAffineUnitChangeTool;

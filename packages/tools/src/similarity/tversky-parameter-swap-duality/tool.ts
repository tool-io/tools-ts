import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly intersection: number;
  readonly leftOnly: number;
  readonly rightOnly: number;
  readonly alpha: number;
  readonly beta: number;
};
export type Output = {
  readonly forward: number;
  readonly reverseWithSwappedWeights: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersection: { type: "integer", minimum: 0 },
    leftOnly: { type: "integer", minimum: 0 },
    rightOnly: { type: "integer", minimum: 0 },
    alpha: { type: "number" },
    beta: { type: "number" },
  },
  required: ["intersection", "leftOnly", "rightOnly", "alpha", "beta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forward: { type: "number" },
    reverseWithSwappedWeights: { type: "number" },
  },
  required: ["forward", "reverseWithSwappedWeights"],
} as const;
/** Compute tversky parameter swap duality from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { intersection, leftOnly, rightOnly, alpha, beta } = input;
  const compute = (): Output => {
    integer(intersection);
    integer(leftOnly);
    integer(rightOnly);
    domain(alpha >= 0 && beta >= 0);
    const d = intersection + alpha * leftOnly + beta * rightOnly;
    positive(d);
    const value = intersection / d;
    return { forward: value, reverseWithSwappedWeights: value };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { intersection: 2, leftOnly: 2, rightOnly: 0, alpha: 1, beta: 2 },
  output: { forward: 0.5, reverseWithSwappedWeights: 0.5 },
} satisfies ToolExample<Input, Output>;
export const tverskyParameterSwapDualityTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "similarity/tversky-parameter-swap-duality",
  title: "Tversky Parameter Swap Duality Tool",
  description:
    "Compute tversky parameter swap duality from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "intersection",
        label: "Intersection",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "leftOnly",
        label: "Left Only",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "rightOnly",
        label: "Right Only",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "alpha",
        label: "Alpha",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "beta",
        label: "Beta",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "forward", label: "Forward", valueType: { type: "number" } },
      {
        id: "reverseWithSwappedWeights",
        label: "Reverse With Swapped Weights",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = tverskyParameterSwapDualityTool.execute;
export default tverskyParameterSwapDualityTool;

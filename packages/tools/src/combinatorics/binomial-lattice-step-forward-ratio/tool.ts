import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly n: number; readonly k: number };
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: { type: "integer", minimum: 1 },
    k: { type: "integer", minimum: 0 },
  },
  required: ["n", "k"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate binomial lattice step forward ratio from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { n, k } = input;
  const compute = (): Output => {
    H.integer(n, 1);
    H.integer(k, 0, n - 1);
    return { ratio: (n - k) / (k + 1) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { n: 5, k: 2 },
  output: { ratio: 1 },
} satisfies ToolExample<Input, Output>;
export const binomialLatticeStepForwardRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/binomial-lattice-step-forward-ratio",
    title: "Binomial Lattice Step Forward Ratio Tool",
    description:
      "Calculate binomial lattice step forward ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        n: { type: "integer", minimum: 1 },
        k: { type: "integer", minimum: 0 },
      },
      required: ["n", "k"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        { id: "n", label: "N", required: true, valueType: { type: "integer" } },
        { id: "k", label: "K", required: true, valueType: { type: "integer" } },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = binomialLatticeStepForwardRatioTool.execute;
export default binomialLatticeStepForwardRatioTool;

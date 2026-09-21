import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly leading: number; readonly linear: number };
export type Output = { readonly pairwiseSum: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leading: { type: "number" }, linear: { type: "number" } },
  required: ["leading", "linear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pairwiseSum: { type: "number" } },
  required: ["pairwiseSum"],
} as const;
/** Compute cubic vieta pairwise root sum from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { leading, linear } = input;
  const compute = (): Output => {
    domain(leading !== 0);
    return { pairwiseSum: linear / leading };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leading: 2, linear: 12 },
  output: { pairwiseSum: 6 },
} satisfies ToolExample<Input, Output>;
export const cubicVietaPairwiseRootSumTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "algebra/cubic-vieta-pairwise-root-sum",
  title: "Cubic Vieta Pairwise Root Sum Tool",
  description:
    "Compute cubic vieta pairwise root sum from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "leading",
        label: "Leading",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "linear",
        label: "Linear",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "pairwiseSum",
        label: "Pairwise Sum",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = cubicVietaPairwiseRootSumTool.execute;
export default cubicVietaPairwiseRootSumTool;

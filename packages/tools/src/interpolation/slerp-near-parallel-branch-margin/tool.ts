import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly cosine: number; readonly threshold: number };
export type Output = {
  readonly linearBranch: boolean;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cosine: { type: "number" }, threshold: { type: "number" } },
  required: ["cosine", "threshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { linearBranch: { type: "boolean" }, margin: { type: "number" } },
  required: ["linearBranch", "margin"],
} as const;
/** Compute slerp near parallel branch margin from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { cosine, threshold } = input;
  const compute = (): Output => {
    domain(cosine >= -1 && cosine <= 1 && threshold >= 0 && threshold <= 1);
    return { linearBranch: cosine > threshold, margin: cosine - threshold };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { cosine: 1, threshold: 0.5 },
  output: { linearBranch: true, margin: 0.5 },
} satisfies ToolExample<Input, Output>;
export const slerpNearParallelBranchMarginTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "interpolation/slerp-near-parallel-branch-margin",
  title: "Slerp Near Parallel Branch Margin Tool",
  description:
    "Compute slerp near parallel branch margin from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "cosine",
        label: "Cosine",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "threshold",
        label: "Threshold",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "linearBranch",
        label: "Linear Branch",
        valueType: { type: "boolean" },
      },
      { id: "margin", label: "Margin", valueType: { type: "number" } },
    ],
  },
});
export const run = slerpNearParallelBranchMarginTool.execute;
export default slerpNearParallelBranchMarginTool;

import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly status: string };
export type Output = { readonly kind: string; readonly similarity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", maxLength: 8192 },
    similarity: { type: "integer" },
  },
  required: ["kind", "similarity"],
} as const;
/** Compute git diff status rename percentage from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { status } = input;
  const compute = (): Output => {
    const m = /^([RC])(\d{1,3})(?![\s\S])/.exec(status);
    domain(m && Number(m[2]) <= 100);
    return { kind: m[1] === "R" ? "rename" : "copy", similarity: Number(m[2]) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { status: "R095" },
  output: { kind: "rename", similarity: 95 },
} satisfies ToolExample<Input, Output>;
export const gitDiffStatusRenamePercentageTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/git-diff-status-rename-percentage",
  title: "Git Diff Status Rename Percentage Tool",
  description:
    "Compute git diff status rename percentage from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "status",
        label: "Status",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "kind", label: "Kind", valueType: { type: "string" } },
      { id: "similarity", label: "Similarity", valueType: { type: "integer" } },
    ],
  },
});
export const run = gitDiffStatusRenamePercentageTool.execute;
export default gitDiffStatusRenamePercentageTool;

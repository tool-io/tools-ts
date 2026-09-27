import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly branchLengths: readonly number[] };
export type Output = { readonly pathLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branchLengths: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
  },
  required: ["branchLengths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pathLength: { type: "number" } },
  required: ["pathLength"],
} as const;
/** Sum an explicitly supplied tree path’s branch lengths without inferring topology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { branchLengths } = request;
  const compute = (): Output => {
    H.domain(branchLengths.every((x) => x >= 0));
    return { pathLength: branchLengths.reduce((a, b) => a + b, 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { branchLengths: [0.1, 0.2, 0.3] },
  output: { pathLength: 0.6000000000000001 },
} satisfies ToolExample<Input, Output>;
export const phylogenyPathBranchSumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/phylogeny-path-branch-sum",
    title: "Phylogeny Path Branch Sum Tool",
    description:
      "Sum an explicitly supplied tree path’s branch lengths without inferring topology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        branchLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
      },
      required: ["branchLengths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pathLength: { type: "number" } },
      required: ["pathLength"],
    },
    ports: {
      inputs: [
        {
          id: "branchLengths",
          label: "Branch Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "pathLength",
          label: "Path Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = phylogenyPathBranchSumTool.execute;
export default phylogenyPathBranchSumTool;

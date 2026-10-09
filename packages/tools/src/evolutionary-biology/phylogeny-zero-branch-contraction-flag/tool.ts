import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly branchLength: number;
  readonly contractionEnabled: boolean;
};
export type Output = { readonly contractBranch: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branchLength: { type: "number", minimum: 0 },
    contractionEnabled: { type: "boolean" },
  },
  required: ["branchLength", "contractionEnabled"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contractBranch: { type: "boolean" } },
  required: ["contractBranch"],
} as const;
/** Flag exact zero-length supplied phylogeny branches under an explicit contraction switch without modifying topology or inferring polytomies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { branchLength, contractionEnabled } = request;
  const compute = (): Output => {
    H.domain(branchLength >= 0, "branchLength");
    return { contractBranch: contractionEnabled && branchLength === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { branchLength: 0, contractionEnabled: true },
  output: { contractBranch: true },
} satisfies ToolExample<Input, Output>;
export const phylogenyZeroBranchContractionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/phylogeny-zero-branch-contraction-flag",
    title: "Phylogeny Zero Branch Contraction Flag Tool",
    description:
      "Flag exact zero-length supplied phylogeny branches under an explicit contraction switch without modifying topology or inferring polytomies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        branchLength: { type: "number", minimum: 0 },
        contractionEnabled: { type: "boolean" },
      },
      required: ["branchLength", "contractionEnabled"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contractBranch: { type: "boolean" } },
      required: ["contractBranch"],
    },
    ports: {
      inputs: [
        {
          id: "branchLength",
          label: "Branch Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contractionEnabled",
          label: "Contraction Enabled",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "contractBranch",
          label: "Contract Branch",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = phylogenyZeroBranchContractionFlagTool.execute;
export default phylogenyZeroBranchContractionFlagTool;

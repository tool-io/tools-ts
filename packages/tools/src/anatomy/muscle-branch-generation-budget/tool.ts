import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly branchCounts: readonly number[];
  readonly included: readonly boolean[];
};
export type Output = {
  readonly includedBranches: number;
  readonly excludedBranches: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branchCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
    included: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["branchCounts", "included"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includedBranches: { type: "integer" },
    excludedBranches: { type: "integer" },
  },
  required: ["includedBranches", "excludedBranches"],
} as const;
/** Sum independently supplied per-generation branch counts; no branching ratio or anatomy is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { branchCounts, included } = request;
  const compute = (): Output => {
    H.sameLength(branchCounts, included);
    H.domain(branchCounts.every((x) => x >= 0));
    return {
      includedBranches: branchCounts.reduce(
        (a, b, i) => a + (included[i] ? b : 0),
        0,
      ),
      excludedBranches: branchCounts.reduce(
        (a, b, i) => a + (included[i] ? 0 : b),
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { branchCounts: [2, 4, 8], included: [true, true, false] },
  output: { includedBranches: 6, excludedBranches: 8 },
} satisfies ToolExample<Input, Output>;
export const muscleBranchGenerationBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/muscle-branch-generation-budget",
    title: "Muscle Branch Generation Budget Tool",
    description:
      "Sum independently supplied per-generation branch counts; no branching ratio or anatomy is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        branchCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        included: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["branchCounts", "included"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        includedBranches: { type: "integer" },
        excludedBranches: { type: "integer" },
      },
      required: ["includedBranches", "excludedBranches"],
    },
    ports: {
      inputs: [
        {
          id: "branchCounts",
          label: "Branch Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "included",
          label: "Included",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "includedBranches",
          label: "Included Branches",
          valueType: { type: "integer" },
        },
        {
          id: "excludedBranches",
          label: "Excluded Branches",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = muscleBranchGenerationBudgetTool.execute;
export default muscleBranchGenerationBudgetTool;

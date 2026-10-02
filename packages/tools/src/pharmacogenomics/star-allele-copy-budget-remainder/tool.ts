import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly alleleTokens: readonly string[];
  readonly copyCounts: readonly number[];
  readonly suppliedTotalCopies: number;
};
export type Output = {
  readonly assignedCopies: number;
  readonly unassignedCopies: number;
  readonly duplicateAlleleTokens: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alleleTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    copyCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
    suppliedTotalCopies: { type: "integer", minimum: 0 },
  },
  required: ["alleleTokens", "copyCounts", "suppliedTotalCopies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assignedCopies: { type: "integer" },
    unassignedCopies: { type: "integer" },
    duplicateAlleleTokens: { type: "boolean" },
  },
  required: ["assignedCopies", "unassignedCopies", "duplicateAlleleTokens"],
} as const;
/** Audit caller-supplied allele labels and copy counts without allele calling, phenotype inference or dosing guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alleleTokens, copyCounts, suppliedTotalCopies } = request;
  const compute = (): Output => {
    H.sameLength(alleleTokens, copyCounts);
    H.integer(suppliedTotalCopies, 0);
    H.domain(copyCounts.every((x) => x >= 0));
    const assignedCopies = copyCounts.reduce((a, b) => a + b, 0);
    H.domain(assignedCopies <= suppliedTotalCopies);
    return {
      assignedCopies,
      unassignedCopies: suppliedTotalCopies - assignedCopies,
      duplicateAlleleTokens: new Set(alleleTokens).size !== alleleTokens.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    alleleTokens: ["*1", "*2"],
    copyCounts: [1, 1],
    suppliedTotalCopies: 3,
  },
  output: {
    assignedCopies: 2,
    unassignedCopies: 1,
    duplicateAlleleTokens: false,
  },
} satisfies ToolExample<Input, Output>;
export const starAlleleCopyBudgetRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/star-allele-copy-budget-remainder",
    title: "Star Allele Copy Budget Remainder Tool",
    description:
      "Audit caller-supplied allele labels and copy counts without allele calling, phenotype inference or dosing guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alleleTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        copyCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        suppliedTotalCopies: { type: "integer", minimum: 0 },
      },
      required: ["alleleTokens", "copyCounts", "suppliedTotalCopies"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assignedCopies: { type: "integer" },
        unassignedCopies: { type: "integer" },
        duplicateAlleleTokens: { type: "boolean" },
      },
      required: ["assignedCopies", "unassignedCopies", "duplicateAlleleTokens"],
    },
    ports: {
      inputs: [
        {
          id: "alleleTokens",
          label: "Allele Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "copyCounts",
          label: "Copy Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "suppliedTotalCopies",
          label: "Supplied Total Copies",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "assignedCopies",
          label: "Assigned Copies",
          valueType: { type: "integer" },
        },
        {
          id: "unassignedCopies",
          label: "Unassigned Copies",
          valueType: { type: "integer" },
        },
        {
          id: "duplicateAlleleTokens",
          label: "Duplicate Allele Tokens",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = starAlleleCopyBudgetRemainderTool.execute;
export default starAlleleCopyBudgetRemainderTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly branchLabels: readonly string[];
  readonly itemIds: readonly string[];
  readonly selectedBranches: readonly string[];
};
export type Output = {
  readonly selectedRecords: number;
  readonly distinctItems: number;
  readonly repeatedSelectedRecords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branchLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    itemIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    selectedBranches: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["branchLabels", "itemIds", "selectedBranches"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedRecords: { type: "integer" },
    distinctItems: { type: "integer" },
    repeatedSelectedRecords: { type: "integer" },
  },
  required: ["selectedRecords", "distinctItems", "repeatedSelectedRecords"],
} as const;
/** Calculate assessment branch item count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { branchLabels, itemIds, selectedBranches } = request;
  const compute = (): Output => {
    H.sameLength(branchLabels, itemIds);
    return (() => {
      const ids = itemIds.filter((x, i) =>
          selectedBranches.includes(branchLabels[i]),
        ),
        distinctItems = new Set(ids).size;
      return {
        selectedRecords: ids.length,
        distinctItems,
        repeatedSelectedRecords: ids.length - distinctItems,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    branchLabels: ["A", "B", "A"],
    itemIds: ["i1", "i2", "i1"],
    selectedBranches: ["A"],
  },
  output: { selectedRecords: 2, distinctItems: 1, repeatedSelectedRecords: 1 },
} satisfies ToolExample<Input, Output>;
export const assessmentBranchItemCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/assessment-branch-item-count",
    title: "Assessment Branch Item Count Tool",
    description:
      "Calculate assessment branch item count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        branchLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        itemIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        selectedBranches: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["branchLabels", "itemIds", "selectedBranches"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectedRecords: { type: "integer" },
        distinctItems: { type: "integer" },
        repeatedSelectedRecords: { type: "integer" },
      },
      required: ["selectedRecords", "distinctItems", "repeatedSelectedRecords"],
    },
    ports: {
      inputs: [
        {
          id: "branchLabels",
          label: "Branch Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "itemIds",
          label: "Item Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "selectedBranches",
          label: "Selected Branches",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "selectedRecords",
          label: "Selected Records",
          valueType: { type: "integer" },
        },
        {
          id: "distinctItems",
          label: "Distinct Items",
          valueType: { type: "integer" },
        },
        {
          id: "repeatedSelectedRecords",
          label: "Repeated Selected Records",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = assessmentBranchItemCountTool.execute;
export default assessmentBranchItemCountTool;

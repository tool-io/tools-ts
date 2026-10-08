import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstItem: string;
  readonly secondItem: string;
  readonly itemCodes: readonly string[];
  readonly groupCodes: readonly string[];
};
export type Output = {
  readonly bothAssigned: boolean;
  readonly sameGroup: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstItem: { type: "string", maxLength: 8192 },
    secondItem: { type: "string", maxLength: 8192 },
    itemCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    groupCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["firstItem", "secondItem", "itemCodes", "groupCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bothAssigned: { type: "boolean" },
    sameGroup: { type: "boolean" },
  },
  required: ["bothAssigned", "sameGroup"],
} as const;
/** Check one item pair’s explicit pile-sort assignments while distinguishing an unassigned item from a different-group assignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstItem, secondItem, itemCodes, groupCodes } = request;
  const compute = (): Output => {
    H.domain(itemCodes.length === groupCodes.length, "groupCodes");
    H.domain(new Set(itemCodes).size === itemCodes.length, "itemCodes");
    const a = itemCodes.indexOf(firstItem),
      b = itemCodes.indexOf(secondItem),
      bothAssigned = a >= 0 && b >= 0;
    return {
      bothAssigned,
      sameGroup: bothAssigned && groupCodes[a] === groupCodes[b],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstItem: "A",
    secondItem: "B",
    itemCodes: ["A", "B", "C"],
    groupCodes: ["G1", "G1", "G2"],
  },
  output: { bothAssigned: true, sameGroup: true },
} satisfies ToolExample<Input, Output>;
export const pileSortItemPairSameGroupFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "cultural-anthropology",
        "cultural anthropology",
        "social sciences",
      ],
      keywords: ["cultural anthropology", "social sciences"],
    },
    id: "cultural-anthropology/pile-sort-item-pair-same-group-flag",
    title: "Pile Sort Item Pair Same Group Flag",
    description:
      "Check one item pair’s explicit pile-sort assignments while distinguishing an unassigned item from a different-group assignment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstItem: { type: "string", maxLength: 8192 },
        secondItem: { type: "string", maxLength: 8192 },
        itemCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        groupCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["firstItem", "secondItem", "itemCodes", "groupCodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bothAssigned: { type: "boolean" },
        sameGroup: { type: "boolean" },
      },
      required: ["bothAssigned", "sameGroup"],
    },
    ports: {
      inputs: [
        {
          id: "firstItem",
          label: "First Item",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondItem",
          label: "Second Item",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "itemCodes",
          label: "Item Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "groupCodes",
          label: "Group Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "bothAssigned",
          label: "Both Assigned",
          valueType: { type: "boolean" },
        },
        {
          id: "sameGroup",
          label: "Same Group",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = pileSortItemPairSameGroupFlagTool.execute;
export default pileSortItemPairSameGroupFlagTool;

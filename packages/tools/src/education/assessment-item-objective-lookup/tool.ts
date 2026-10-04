import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemIds: readonly string[];
  readonly objectiveCodes: readonly string[];
  readonly itemId: string;
};
export type Output = { readonly objectiveCode: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    objectiveCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    itemId: { type: "string", maxLength: 8192 },
  },
  required: ["itemIds", "objectiveCodes", "itemId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { objectiveCode: { type: "string", maxLength: 8192 } },
  required: ["objectiveCode"],
} as const;
/** Resolve one assessment item's objective from an explicit unique-key curriculum mapping; no objective is inferred from question text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemIds, objectiveCodes, itemId } = request;
  const compute = (): Output => {
    H.sameLength(itemIds, objectiveCodes);
    H.domain(new Set(itemIds).size === itemIds.length, "itemIds");
    const index = itemIds.indexOf(itemId);
    H.domain(index >= 0, "itemId");
    return { objectiveCode: objectiveCodes[index] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemIds: ["Q1", "Q2"],
    objectiveCodes: ["O-A", "O-B"],
    itemId: "Q2",
  },
  output: { objectiveCode: "O-B" },
} satisfies ToolExample<Input, Output>;
export const assessmentItemObjectiveLookupTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/assessment-item-objective-lookup",
    title: "Assessment Item Objective Lookup Tool",
    description:
      "Resolve one assessment item's objective from an explicit unique-key curriculum mapping; no objective is inferred from question text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        objectiveCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        itemId: { type: "string", maxLength: 8192 },
      },
      required: ["itemIds", "objectiveCodes", "itemId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { objectiveCode: { type: "string", maxLength: 8192 } },
      required: ["objectiveCode"],
    },
    ports: {
      inputs: [
        {
          id: "itemIds",
          label: "Item Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "objectiveCodes",
          label: "Objective Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "itemId",
          label: "Item Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "objectiveCode",
          label: "Objective Code",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = assessmentItemObjectiveLookupTool.execute;
export default assessmentItemObjectiveLookupTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemIds: readonly string[];
  readonly firstModes: readonly string[];
  readonly secondModes: readonly string[];
  readonly unknownMode: string;
};
export type Output = {
  readonly pairedKnown: number;
  readonly changedModes: number;
  readonly unknownPairs: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    firstModes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondModes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unknownMode: { type: "string", maxLength: 8192 },
  },
  required: ["itemIds", "firstModes", "secondModes", "unknownMode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pairedKnown: { type: "integer" },
    changedModes: { type: "integer" },
    unknownPairs: { type: "integer" },
  },
  required: ["pairedKnown", "changedModes", "unknownPairs"],
} as const;
/** Compare explicit response-mode labels across matched research items without scoring development. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemIds, firstModes, secondModes, unknownMode } = request;
  const compute = (): Output => {
    H.sameLength(itemIds, firstModes);
    H.sameLength(itemIds, secondModes);
    H.domain(new Set(itemIds).size === itemIds.length);
    return {
      pairedKnown: itemIds.filter(
        (x, i) =>
          firstModes[i] !== unknownMode && secondModes[i] !== unknownMode,
      ).length,
      changedModes: itemIds.filter(
        (x, i) =>
          firstModes[i] !== unknownMode &&
          secondModes[i] !== unknownMode &&
          firstModes[i] !== secondModes[i],
      ).length,
      unknownPairs: itemIds.filter(
        (x, i) =>
          firstModes[i] === unknownMode || secondModes[i] === unknownMode,
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemIds: ["a", "b", "c"],
    firstModes: ["oral", "text", "?"],
    secondModes: ["text", "text", "oral"],
    unknownMode: "?",
  },
  output: { pairedKnown: 2, changedModes: 1, unknownPairs: 1 },
} satisfies ToolExample<Input, Output>;
export const caregiverResponseModeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/caregiver-response-mode-gap",
    title: "Caregiver Response Mode Gap Tool",
    description:
      "Compare explicit response-mode labels across matched research items without scoring development.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        firstModes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        secondModes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        unknownMode: { type: "string", maxLength: 8192 },
      },
      required: ["itemIds", "firstModes", "secondModes", "unknownMode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pairedKnown: { type: "integer" },
        changedModes: { type: "integer" },
        unknownPairs: { type: "integer" },
      },
      required: ["pairedKnown", "changedModes", "unknownPairs"],
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
          id: "firstModes",
          label: "First Modes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "secondModes",
          label: "Second Modes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "unknownMode",
          label: "Unknown Mode",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "pairedKnown",
          label: "Paired Known",
          valueType: { type: "integer" },
        },
        {
          id: "changedModes",
          label: "Changed Modes",
          valueType: { type: "integer" },
        },
        {
          id: "unknownPairs",
          label: "Unknown Pairs",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = caregiverResponseModeGapTool.execute;
export default caregiverResponseModeGapTool;

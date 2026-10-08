import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly encounterIds: readonly string[] };
export type Output = {
  readonly duplicateAfterFirst: readonly boolean[];
  readonly duplicateIds: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    encounterIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["encounterIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duplicateAfterFirst: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    duplicateIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["duplicateAfterFirst", "duplicateIds"],
} as const;
/** Flag exact repeated encounter IDs after their first appearance without linking records by patient identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { encounterIds } = request;
  const compute = (): Output => {
    const seen = new Set<string>(),
      duplicates = new Set<string>();
    const duplicateAfterFirst = encounterIds.map((id) => {
      const duplicate = seen.has(id);
      if (duplicate) duplicates.add(id);
      seen.add(id);
      return duplicate;
    });
    return { duplicateAfterFirst, duplicateIds: [...duplicates] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { encounterIds: ["E1", "E2", "E1", "E2"] },
  output: {
    duplicateAfterFirst: [false, false, true, true],
    duplicateIds: ["E1", "E2"],
  },
} satisfies ToolExample<Input, Output>;
export const emergencyEncounterDuplicateIdFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "emergency-medicine",
        "emergency medicine",
        "health and medicine",
      ],
      keywords: ["emergency medicine", "health and medicine"],
    },
    id: "emergency-medicine/emergency-encounter-duplicate-id-flag",
    title: "Emergency Encounter Duplicate ID Flag",
    description:
      "Flag exact repeated encounter IDs after their first appearance without linking records by patient identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        encounterIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["encounterIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        duplicateAfterFirst: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        duplicateIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["duplicateAfterFirst", "duplicateIds"],
    },
    ports: {
      inputs: [
        {
          id: "encounterIds",
          label: "Encounter Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "duplicateAfterFirst",
          label: "Duplicate After First",
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "duplicateIds",
          label: "Duplicate Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = emergencyEncounterDuplicateIdFlagTool.execute;
export default emergencyEncounterDuplicateIdFlagTool;

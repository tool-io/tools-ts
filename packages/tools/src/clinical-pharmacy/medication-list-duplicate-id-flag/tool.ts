import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly recordIds: readonly string[] };
export type Output = {
  readonly duplicatePositions: readonly number[];
  readonly uniqueIds: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["recordIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duplicatePositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    uniqueIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["duplicatePositions", "uniqueIds"],
} as const;
/** Find duplicate supplied record identifiers without inferring duplicate therapy from medicine names. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordIds } = request;
  const compute = (): Output => {
    const seen = new Set<string>(),
      duplicatePositions: number[] = [];
    recordIds.forEach((x, i) => {
      if (seen.has(x)) duplicatePositions.push(i);
      seen.add(x);
    });
    return { duplicatePositions, uniqueIds: [...seen] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordIds: ["M1", "M2", "M1"] },
  output: { duplicatePositions: [2], uniqueIds: ["M1", "M2"] },
} satisfies ToolExample<Input, Output>;
export const medicationListDuplicateIdFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/medication-list-duplicate-id-flag",
    title: "Medication List Duplicate ID Flag Tool",
    description:
      "Find duplicate supplied record identifiers without inferring duplicate therapy from medicine names.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["recordIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        duplicatePositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        uniqueIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["duplicatePositions", "uniqueIds"],
    },
    ports: {
      inputs: [
        {
          id: "recordIds",
          label: "Record Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "duplicatePositions",
          label: "Duplicate Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "uniqueIds",
          label: "Unique Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = medicationListDuplicateIdFlagTool.execute;
export default medicationListDuplicateIdFlagTool;

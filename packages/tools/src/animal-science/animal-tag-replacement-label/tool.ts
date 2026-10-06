import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly animalRecordCode: string;
  readonly oldTag: string;
  readonly newTag: string;
};
export type Output = { readonly label: string; readonly changed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    animalRecordCode: { type: "string", maxLength: 8192, minLength: 1 },
    oldTag: { type: "string", maxLength: 8192, minLength: 1 },
    newTag: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["animalRecordCode", "oldTag", "newTag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    changed: { type: "boolean" },
  },
  required: ["label", "changed"],
} as const;
/** Label an explicitly recorded animal-tag replacement while preserving both tag spellings and leading zeros. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { animalRecordCode, oldTag, newTag } = request;
  const compute = (): Output => {
    H.domain(
      animalRecordCode.length > 0 && oldTag.length > 0 && newTag.length > 0,
      "animalRecordCode",
    );
    return {
      label:
        animalRecordCode +
        ": " +
        JSON.stringify(oldTag) +
        " → " +
        JSON.stringify(newTag),
      changed: oldTag !== newTag,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { animalRecordCode: "A17", oldTag: "0012", newTag: "0099" },
  output: { label: 'A17: "0012" → "0099"', changed: true },
} satisfies ToolExample<Input, Output>;
export const animalTagReplacementLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["animal-science", "animal science", "agriculture"],
      keywords: ["animal science", "agriculture"],
    },
    id: "animal-science/animal-tag-replacement-label",
    title: "Animal Tag Replacement Label",
    description:
      "Label an explicitly recorded animal-tag replacement while preserving both tag spellings and leading zeros.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        animalRecordCode: { type: "string", maxLength: 8192, minLength: 1 },
        oldTag: { type: "string", maxLength: 8192, minLength: 1 },
        newTag: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["animalRecordCode", "oldTag", "newTag"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        changed: { type: "boolean" },
      },
      required: ["label", "changed"],
    },
    ports: {
      inputs: [
        {
          id: "animalRecordCode",
          label: "Animal Record Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "oldTag",
          label: "Old Tag",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "newTag",
          label: "New Tag",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "changed", label: "Changed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = animalTagReplacementLabelTool.execute;
export default animalTagReplacementLabelTool;

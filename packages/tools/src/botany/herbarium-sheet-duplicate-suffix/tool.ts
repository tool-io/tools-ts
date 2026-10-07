import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sheetIdentifier: string;
  readonly duplicateSuffix: string;
  readonly separator: string;
};
export type Output = { readonly duplicateIdentifier: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sheetIdentifier: { type: "string", maxLength: 8192, minLength: 1 },
    duplicateSuffix: { type: "string", maxLength: 8192, minLength: 1 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["sheetIdentifier", "duplicateSuffix", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { duplicateIdentifier: { type: "string", maxLength: 8192 } },
  required: ["duplicateIdentifier"],
} as const;
/** Append an explicit duplicate suffix and separator to supplied herbarium sheet text while preserving leading zeros. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sheetIdentifier, duplicateSuffix, separator } = request;
  const compute = (): Output => {
    H.domain(sheetIdentifier.length > 0, "sheetIdentifier");
    H.domain(duplicateSuffix.length > 0, "duplicateSuffix");
    return {
      duplicateIdentifier: sheetIdentifier + separator + duplicateSuffix,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sheetIdentifier: "00124", duplicateSuffix: "b", separator: "" },
  output: { duplicateIdentifier: "00124b" },
} satisfies ToolExample<Input, Output>;
export const herbariumSheetDuplicateSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/herbarium-sheet-duplicate-suffix",
    title: "Herbarium Sheet Duplicate Suffix Tool",
    description:
      "Append an explicit duplicate suffix and separator to supplied herbarium sheet text while preserving leading zeros.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sheetIdentifier: { type: "string", maxLength: 8192, minLength: 1 },
        duplicateSuffix: { type: "string", maxLength: 8192, minLength: 1 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["sheetIdentifier", "duplicateSuffix", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { duplicateIdentifier: { type: "string", maxLength: 8192 } },
      required: ["duplicateIdentifier"],
    },
    ports: {
      inputs: [
        {
          id: "sheetIdentifier",
          label: "Sheet Identifier",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "duplicateSuffix",
          label: "Duplicate Suffix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "duplicateIdentifier",
          label: "Duplicate Identifier",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = herbariumSheetDuplicateSuffixTool.execute;
export default herbariumSheetDuplicateSuffixTool;

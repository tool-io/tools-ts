import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly fieldSource: string };
export type Output = {
  readonly lexicallyEmpty: boolean;
  readonly quotedEmpty: boolean;
  readonly decodedText: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fieldSource: { type: "string", maxLength: 8192 } },
  required: ["fieldSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lexicallyEmpty: { type: "boolean" },
    quotedEmpty: { type: "boolean" },
    decodedText: { type: "string", maxLength: 8192 },
  },
  required: ["lexicallyEmpty", "quotedEmpty", "decodedText"],
} as const;
/** Distinguish the lexical forms of an empty CSV field and a quoted empty field; both decode to empty text under RFC 4180. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldSource } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(fieldSource === "" || fieldSource === '""', "fieldSource");
      return {
        lexicallyEmpty: fieldSource === "",
        quotedEmpty: fieldSource === '""',
        decodedText: "",
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fieldSource: '""' },
  output: { lexicallyEmpty: false, quotedEmpty: true, decodedText: "" },
} satisfies ToolExample<Input, Output>;
export const csvEmptyQuotedFieldDistinctionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["parse", "data parsing", "computer science"],
      keywords: ["data parsing", "computer science"],
    },
    id: "parse/csv-empty-quoted-field-distinction",
    title: "CSV Empty Quoted Field Distinction",
    description:
      "Distinguish the lexical forms of an empty CSV field and a quoted empty field; both decode to empty text under RFC 4180.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fieldSource: { type: "string", maxLength: 8192 } },
      required: ["fieldSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lexicallyEmpty: { type: "boolean" },
        quotedEmpty: { type: "boolean" },
        decodedText: { type: "string", maxLength: 8192 },
      },
      required: ["lexicallyEmpty", "quotedEmpty", "decodedText"],
    },
    ports: {
      inputs: [
        {
          id: "fieldSource",
          label: "Field Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "lexicallyEmpty",
          label: "Lexically Empty",
          valueType: { type: "boolean" },
        },
        {
          id: "quotedEmpty",
          label: "Quoted Empty",
          valueType: { type: "boolean" },
        },
        {
          id: "decodedText",
          label: "Decoded Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = csvEmptyQuotedFieldDistinctionTool.execute;
export default csvEmptyQuotedFieldDistinctionTool;

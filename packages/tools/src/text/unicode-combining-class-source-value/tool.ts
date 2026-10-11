import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly character: string;
  readonly suppliedCombiningClass: number;
  readonly unicodeVersion: string;
};
export type Output = { readonly sourceQualifiedToken: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    character: { type: "string", maxLength: 8192 },
    suppliedCombiningClass: { type: "integer", minimum: 0, maximum: 255 },
    unicodeVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["character", "suppliedCombiningClass", "unicodeVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sourceQualifiedToken: { type: "string", maxLength: 8192 } },
  required: ["sourceQualifiedToken"],
} as const;
/** Qualify one explicit character and caller-supplied canonical combining class by Unicode version without performing a Unicode database lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { character, suppliedCombiningClass, unicodeVersion } = request;
  const compute = (): Output => {
    H.domain(Array.from(character).length === 1, "character");
    (H.domain(
      Number.isSafeInteger(suppliedCombiningClass) &&
        suppliedCombiningClass >= 0 &&
        suppliedCombiningClass <= 255,
      "suppliedCombiningClass",
    ),
      suppliedCombiningClass);
    H.domain(unicodeVersion.length > 0, "unicodeVersion");
    return {
      sourceQualifiedToken: JSON.stringify([
        character,
        suppliedCombiningClass,
        unicodeVersion,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { character: "é", suppliedCombiningClass: 0, unicodeVersion: "16.0" },
  output: { sourceQualifiedToken: '["é",0,"16.0"]' },
} satisfies ToolExample<Input, Output>;
export const unicodeCombiningClassSourceValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["text", "computer science"],
      keywords: ["text", "computer science"],
    },
    id: "text/unicode-combining-class-source-value",
    title: "Unicode Combining Class Source Value",
    description:
      "Qualify one explicit character and caller-supplied canonical combining class by Unicode version without performing a Unicode database lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        character: { type: "string", maxLength: 8192 },
        suppliedCombiningClass: { type: "integer", minimum: 0, maximum: 255 },
        unicodeVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["character", "suppliedCombiningClass", "unicodeVersion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sourceQualifiedToken: { type: "string", maxLength: 8192 } },
      required: ["sourceQualifiedToken"],
    },
    ports: {
      inputs: [
        {
          id: "character",
          label: "Character",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCombiningClass",
          label: "Supplied Combining Class",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unicodeVersion",
          label: "Unicode Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sourceQualifiedToken",
          label: "Source Qualified Token",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = unicodeCombiningClassSourceValueTool.execute;
export default unicodeCombiningClassSourceValueTool;

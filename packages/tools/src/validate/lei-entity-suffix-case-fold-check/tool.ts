import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entitySuffix: string;
  readonly expectedSuffix: string;
  readonly foldAsciiCase: boolean;
};
export type Output = { readonly matches: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entitySuffix: { type: "string", maxLength: 8192 },
    expectedSuffix: { type: "string", maxLength: 8192 },
    foldAsciiCase: { type: "boolean" },
  },
  required: ["entitySuffix", "expectedSuffix", "foldAsciiCase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matches: { type: "boolean" } },
  required: ["matches"],
} as const;
/** Compare explicit ASCII alphanumeric entity-suffix text with an optional case-fold policy without validating a complete LEI. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entitySuffix, expectedSuffix, foldAsciiCase } = request;
  const compute = (): Output => {
    H.domain(/^[A-Za-z0-9]+(?![\s\S])/.test(entitySuffix), "entitySuffix");
    H.domain(/^[A-Za-z0-9]+(?![\s\S])/.test(expectedSuffix), "expectedSuffix");
    return {
      matches: foldAsciiCase
        ? entitySuffix.toUpperCase() === expectedSuffix.toUpperCase()
        : entitySuffix === expectedSuffix,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entitySuffix: "ab12", expectedSuffix: "AB12", foldAsciiCase: true },
  output: { matches: true },
} satisfies ToolExample<Input, Output>;
export const leiEntitySuffixCaseFoldCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["validate", "data validation", "computer science"],
      keywords: ["data validation", "computer science"],
    },
    id: "validate/lei-entity-suffix-case-fold-check",
    title: "LEI Entity Suffix Case Fold Check",
    description:
      "Compare explicit ASCII alphanumeric entity-suffix text with an optional case-fold policy without validating a complete LEI.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entitySuffix: { type: "string", maxLength: 8192 },
        expectedSuffix: { type: "string", maxLength: 8192 },
        foldAsciiCase: { type: "boolean" },
      },
      required: ["entitySuffix", "expectedSuffix", "foldAsciiCase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { matches: { type: "boolean" } },
      required: ["matches"],
    },
    ports: {
      inputs: [
        {
          id: "entitySuffix",
          label: "Entity Suffix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedSuffix",
          label: "Expected Suffix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "foldAsciiCase",
          label: "Fold Ascii Case",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = leiEntitySuffixCaseFoldCheckTool.execute;
export default leiEntitySuffixCaseFoldCheckTool;

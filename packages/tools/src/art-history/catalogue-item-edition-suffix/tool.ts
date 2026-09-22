import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly identifier: string; readonly delimiter: string };
export type Output = {
  readonly base: string;
  readonly edition: string;
  readonly hasEdition: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifier: { type: "string", maxLength: 8192 },
    delimiter: { type: "string", maxLength: 8192 },
  },
  required: ["identifier", "delimiter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
    hasEdition: { type: "boolean" },
  },
  required: ["base", "edition", "hasEdition"],
} as const;
/** Split a supplied catalogue identifier at its last explicit edition delimiter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifier, delimiter } = request;
  const compute = (): Output => {
    H.domain(delimiter.length > 0);
    const i = identifier.lastIndexOf(delimiter);
    return {
      base: i < 0 ? identifier : identifier.slice(0, i),
      edition: i < 0 ? "" : identifier.slice(i + delimiter.length),
      hasEdition: i >= 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { identifier: "ABC@2", delimiter: "@" },
  output: { base: "ABC", edition: "2", hasEdition: true },
} satisfies ToolExample<Input, Output>;
export const catalogueItemEditionSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/catalogue-item-edition-suffix",
    title: "Catalogue Item Edition Suffix Tool",
    description:
      "Split a supplied catalogue identifier at its last explicit edition delimiter.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        identifier: { type: "string", maxLength: 8192 },
        delimiter: { type: "string", maxLength: 8192 },
      },
      required: ["identifier", "delimiter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        base: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
        hasEdition: { type: "boolean" },
      },
      required: ["base", "edition", "hasEdition"],
    },
    ports: {
      inputs: [
        {
          id: "identifier",
          label: "Identifier",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "delimiter",
          label: "Delimiter",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "base", label: "Base", valueType: { type: "string" } },
        { id: "edition", label: "Edition", valueType: { type: "string" } },
        {
          id: "hasEdition",
          label: "Has Edition",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = catalogueItemEditionSuffixTool.execute;
export default catalogueItemEditionSuffixTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly catalogueId: string;
  readonly entryNumberText: string;
  readonly subnumberText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    catalogueId: { type: "string", maxLength: 8192, minLength: 1 },
    entryNumberText: { type: "string", maxLength: 8192, minLength: 1 },
    subnumberText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["catalogueId", "entryNumberText", "subnumberText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an unambiguous explicit catalogue entry and subnumber key while preserving source numbering. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { catalogueId, entryNumberText, subnumberText } = request;
  const compute = (): Output => {
    H.domain(catalogueId.length > 0, "catalogueId");
    H.domain(entryNumberText.length > 0, "entryNumberText");
    H.domain(subnumberText.length > 0, "subnumberText");
    return {
      token: JSON.stringify([catalogueId, entryNumberText, subnumberText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { catalogueId: "CAT17", entryNumberText: "42", subnumberText: "b" },
  output: { token: '["CAT17","42","b"]' },
} satisfies ToolExample<Input, Output>;
export const catalogueEntrySubnumberSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-history", "art history", "arts and design"],
      keywords: ["art history", "arts and design"],
    },
    id: "art-history/catalogue-entry-subnumber-suffix",
    title: "Catalogue Entry Subnumber Suffix",
    description:
      "Build an unambiguous explicit catalogue entry and subnumber key while preserving source numbering.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        catalogueId: { type: "string", maxLength: 8192, minLength: 1 },
        entryNumberText: { type: "string", maxLength: 8192, minLength: 1 },
        subnumberText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["catalogueId", "entryNumberText", "subnumberText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "catalogueId",
          label: "Catalogue Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "entryNumberText",
          label: "Entry Number Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "subnumberText",
          label: "Subnumber Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = catalogueEntrySubnumberSuffixTool.execute;
export default catalogueEntrySubnumberSuffixTool;

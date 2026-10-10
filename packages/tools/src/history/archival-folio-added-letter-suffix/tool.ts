import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly folioNumberText: string;
  readonly suppliedSuffix: string;
};
export type Output = { readonly folioLabel: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    folioNumberText: { type: "string", maxLength: 8192 },
    suppliedSuffix: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["folioNumberText", "suppliedSuffix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { folioLabel: { type: "string", maxLength: 8192 } },
  required: ["folioLabel"],
} as const;
/** Append an explicit archival folio suffix to unchanged digit text without interpreting foliation systems. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { folioNumberText, suppliedSuffix } = request;
  const compute = (): Output => {
    H.domain(/^[0-9]+(?![\s\S])/.test(folioNumberText), "folioNumberText");
    H.domain(suppliedSuffix.length > 0, "suppliedSuffix");
    return { folioLabel: folioNumberText + suppliedSuffix };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { folioNumberText: "42", suppliedSuffix: "bis" },
  output: { folioLabel: "42bis" },
} satisfies ToolExample<Input, Output>;
export const archivalFolioAddedLetterSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["history", "humanities"],
      keywords: ["history", "humanities"],
    },
    id: "history/archival-folio-added-letter-suffix",
    title: "Archival Folio Added Letter Suffix",
    description:
      "Append an explicit archival folio suffix to unchanged digit text without interpreting foliation systems.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        folioNumberText: { type: "string", maxLength: 8192 },
        suppliedSuffix: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["folioNumberText", "suppliedSuffix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { folioLabel: { type: "string", maxLength: 8192 } },
      required: ["folioLabel"],
    },
    ports: {
      inputs: [
        {
          id: "folioNumberText",
          label: "Folio Number Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSuffix",
          label: "Supplied Suffix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "folioLabel",
          label: "Folio Label",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = archivalFolioAddedLetterSuffixTool.execute;
export default archivalFolioAddedLetterSuffixTool;

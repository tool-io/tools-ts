import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly censusSourceId: string;
  readonly sheetText: string;
  readonly sideText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    censusSourceId: { type: "string", maxLength: 8192, minLength: 1 },
    sheetText: { type: "string", maxLength: 8192, minLength: 1 },
    sideText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["censusSourceId", "sheetText", "sideText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly transcribed census sheet-side locator without accessing personal census records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { censusSourceId, sheetText, sideText } = request;
  const compute = (): Output => {
    H.domain(censusSourceId.length > 0, "censusSourceId");
    H.domain(sheetText.length > 0, "sheetText");
    H.domain(sideText.length > 0, "sideText");
    return { token: JSON.stringify([censusSourceId, sheetText, sideText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { censusSourceId: "CEN17", sheetText: "12", sideText: "B" },
  output: { token: '["CEN17","12","B"]' },
} satisfies ToolExample<Input, Output>;
export const usCensusSheetSideReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["american-studies", "american studies", "humanities"],
      keywords: ["american studies", "humanities"],
    },
    id: "american-studies/us-census-sheet-side-reference",
    title: "US Census Sheet Side Reference",
    description:
      "Qualify an explicitly transcribed census sheet-side locator without accessing personal census records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        censusSourceId: { type: "string", maxLength: 8192, minLength: 1 },
        sheetText: { type: "string", maxLength: 8192, minLength: 1 },
        sideText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["censusSourceId", "sheetText", "sideText"],
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
          id: "censusSourceId",
          label: "Census Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sheetText",
          label: "Sheet Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sideText",
          label: "Side Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = usCensusSheetSideReferenceTool.execute;
export default usCensusSheetSideReferenceTool;

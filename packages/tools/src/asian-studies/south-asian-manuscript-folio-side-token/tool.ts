import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly folioNumber: number; readonly side: string };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    folioNumber: { type: "integer", minimum: 1 },
    side: { type: "string", maxLength: 8192, enum: ["a", "b"] },
  },
  required: ["folioNumber", "side"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Format an explicit manuscript folio and a/b surface designation without inferring a tradition-specific foliation scheme. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { folioNumber, side } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(folioNumber) &&
        folioNumber >= 1 &&
        folioNumber <= Number.MAX_SAFE_INTEGER,
      "folioNumber",
    ),
      folioNumber);
    H.domain(["a", "b"].includes(side), "side");
    return { token: folioNumber + side };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { folioNumber: 12, side: "b" },
  output: { token: "12b" },
} satisfies ToolExample<Input, Output>;
export const southAsianManuscriptFolioSideTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/south-asian-manuscript-folio-side-token",
    title: "South Asian Manuscript Folio Side Token Tool",
    description:
      "Format an explicit manuscript folio and a/b surface designation without inferring a tradition-specific foliation scheme.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        folioNumber: { type: "integer", minimum: 1 },
        side: { type: "string", maxLength: 8192, enum: ["a", "b"] },
      },
      required: ["folioNumber", "side"],
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
          id: "folioNumber",
          label: "Folio Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = southAsianManuscriptFolioSideTokenTool.execute;
export default southAsianManuscriptFolioSideTokenTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly folioNumber: number; readonly side: string };
export type Output = { readonly reference: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    folioNumber: { type: "integer", minimum: 1 },
    side: { type: "string", maxLength: 8192, enum: ["recto", "verso"] },
  },
  required: ["folioNumber", "side"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
/** Format a historical document folio surface using explicit recto or verso. */
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
    H.domain(["recto", "verso"].includes(side), "side");
    return {
      reference: "fol. " + folioNumber + (side === "recto" ? "r" : "v"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { folioNumber: 12, side: "verso" },
  output: { reference: "fol. 12v" },
} satisfies ToolExample<Input, Output>;
export const historicalDocumentRectoVersoLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/historical-document-recto-verso-label",
    title: "Historical Document Recto Verso Label Tool",
    description:
      "Format a historical document folio surface using explicit recto or verso.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        folioNumber: { type: "integer", minimum: 1 },
        side: { type: "string", maxLength: 8192, enum: ["recto", "verso"] },
      },
      required: ["folioNumber", "side"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reference: { type: "string", maxLength: 8192 } },
      required: ["reference"],
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
      outputs: [
        { id: "reference", label: "Reference", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = historicalDocumentRectoVersoLabelTool.execute;
export default historicalDocumentRectoVersoLabelTool;

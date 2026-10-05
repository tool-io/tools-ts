import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly folio: number; readonly side: string };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    folio: { type: "integer", minimum: 1 },
    side: { type: "string", maxLength: 8192, enum: ["recto", "vuelto"] },
  },
  required: ["folio", "side"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Format explicit folio and recto/vuelto fields using compact r/v suffixes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { folio, side } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(folio) &&
        folio >= 1 &&
        folio <= Number.MAX_SAFE_INTEGER,
      "folio",
    ),
      folio);
    H.domain(["recto", "vuelto"].includes(side), "side");
    return { token: "f. " + folio + (side === "recto" ? "r" : "v") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { folio: 17, side: "vuelto" },
  output: { token: "f. 17v" },
} satisfies ToolExample<Input, Output>;
export const colonialSpanishFolioRectoVersoTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "latin-american-studies/colonial-spanish-folio-recto-verso-token",
      title: "Colonial Spanish Folio Recto Verso Token Tool",
      description:
        "Format explicit folio and recto/vuelto fields using compact r/v suffixes.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          folio: { type: "integer", minimum: 1 },
          side: { type: "string", maxLength: 8192, enum: ["recto", "vuelto"] },
        },
        required: ["folio", "side"],
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
            id: "folio",
            label: "Folio",
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
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = colonialSpanishFolioRectoVersoTokenTool.execute;
export default colonialSpanishFolioRectoVersoTokenTool;

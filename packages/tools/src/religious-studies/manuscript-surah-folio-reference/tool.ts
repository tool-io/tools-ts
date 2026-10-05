import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surahNumber: number;
  readonly folio: number;
  readonly side: string;
};
export type Output = { readonly reference: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surahNumber: { type: "integer", minimum: 1, maximum: 114 },
    folio: { type: "integer", minimum: 1 },
    side: { type: "string", maxLength: 8192, enum: ["r", "v"] },
  },
  required: ["surahNumber", "folio", "side"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
/** Format an explicit surah number and manuscript folio surface without locating text in a manuscript. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surahNumber, folio, side } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(surahNumber) &&
        surahNumber >= 1 &&
        surahNumber <= 114,
      "surahNumber",
    ),
      surahNumber);
    (H.domain(
      Number.isSafeInteger(folio) &&
        folio >= 1 &&
        folio <= Number.MAX_SAFE_INTEGER,
      "folio",
    ),
      folio);
    H.domain(["r", "v"].includes(side), "side");
    return { reference: "surah " + surahNumber + ", fol. " + folio + side };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surahNumber: 12, folio: 34, side: "v" },
  output: { reference: "surah 12, fol. 34v" },
} satisfies ToolExample<Input, Output>;
export const manuscriptSurahFolioReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/manuscript-surah-folio-reference",
    title: "Manuscript Surah Folio Reference Tool",
    description:
      "Format an explicit surah number and manuscript folio surface without locating text in a manuscript.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surahNumber: { type: "integer", minimum: 1, maximum: 114 },
        folio: { type: "integer", minimum: 1 },
        side: { type: "string", maxLength: 8192, enum: ["r", "v"] },
      },
      required: ["surahNumber", "folio", "side"],
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
          id: "surahNumber",
          label: "Surah Number",
          required: true,
          valueType: { type: "integer" },
        },
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
        { id: "reference", label: "Reference", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = manuscriptSurahFolioReferenceTool.execute;
export default manuscriptSurahFolioReferenceTool;

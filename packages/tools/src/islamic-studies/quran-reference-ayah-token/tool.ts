import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surahNumber: number;
  readonly ayahNumber: number;
};
export type Output = { readonly reference: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surahNumber: { type: "integer", minimum: 1 },
    ayahNumber: { type: "integer", minimum: 1 },
  },
  required: ["surahNumber", "ayahNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
/** Format explicit positive surah and ayah ordinals without validating the verse range or resolving a Quran text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surahNumber, ayahNumber } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(surahNumber) &&
        surahNumber >= 1 &&
        surahNumber <= Number.MAX_SAFE_INTEGER,
      "surahNumber",
    ),
      surahNumber);
    (H.domain(
      Number.isSafeInteger(ayahNumber) &&
        ayahNumber >= 1 &&
        ayahNumber <= Number.MAX_SAFE_INTEGER,
      "ayahNumber",
    ),
      ayahNumber);
    return { reference: surahNumber + ":" + ayahNumber };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surahNumber: 2, ayahNumber: 255 },
  output: { reference: "2:255" },
} satisfies ToolExample<Input, Output>;
export const quranReferenceAyahTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["islamic-studies", "islamic studies", "humanities"],
      keywords: ["islamic studies", "humanities"],
    },
    id: "islamic-studies/quran-reference-ayah-token",
    title: "Quran Reference Ayah Token",
    description:
      "Format explicit positive surah and ayah ordinals without validating the verse range or resolving a Quran text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surahNumber: { type: "integer", minimum: 1 },
        ayahNumber: { type: "integer", minimum: 1 },
      },
      required: ["surahNumber", "ayahNumber"],
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
          id: "ayahNumber",
          label: "Ayah Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "reference", label: "Reference", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = quranReferenceAyahTokenTool.execute;
export default quranReferenceAyahTokenTool;

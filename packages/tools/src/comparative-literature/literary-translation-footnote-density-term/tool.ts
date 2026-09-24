import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly notes: number;
  readonly translatedWords: number;
};
export type Output = { readonly perThousandWords: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    notes: { type: "integer", minimum: 0 },
    translatedWords: { type: "integer", minimum: 1 },
  },
  required: ["notes", "translatedWords"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { perThousandWords: { type: "number" } },
  required: ["perThousandWords"],
} as const;
/** Calculate literary translation footnote density term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { notes, translatedWords } = request;
  const compute = (): Output => {
    H.integer(notes, 0);
    H.integer(translatedWords, 1);
    return { perThousandWords: (1000 * notes) / translatedWords };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { notes: 12, translatedWords: 4000 },
  output: { perThousandWords: 3 },
} satisfies ToolExample<Input, Output>;
export const literaryTranslationFootnoteDensityTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "comparative-literature/literary-translation-footnote-density-term",
      title: "Literary Translation Footnote Density Term Tool",
      description:
        "Calculate literary translation footnote density term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          notes: { type: "integer", minimum: 0 },
          translatedWords: { type: "integer", minimum: 1 },
        },
        required: ["notes", "translatedWords"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { perThousandWords: { type: "number" } },
        required: ["perThousandWords"],
      },
      ports: {
        inputs: [
          {
            id: "notes",
            label: "Notes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "translatedWords",
            label: "Translated Words",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "perThousandWords",
            label: "Per Thousand Words",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = literaryTranslationFootnoteDensityTermTool.execute;
export default literaryTranslationFootnoteDensityTermTool;

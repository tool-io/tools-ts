import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reference: string;
  readonly maximumAyah: number;
};
export type Output = {
  readonly surah: number;
  readonly firstAyah: number;
  readonly lastAyah: number;
  readonly count: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "string", maxLength: 8192 },
    maximumAyah: { type: "integer", minimum: 1 },
  },
  required: ["reference", "maximumAyah"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surah: { type: "integer" },
    firstAyah: { type: "integer" },
    lastAyah: { type: "integer" },
    count: { type: "integer" },
  },
  required: ["surah", "firstAyah", "lastAyah", "count"],
} as const;
/** Parse an ASCII surah:ayah[-ayah] inclusive reference with a caller-supplied verse-count bound; no edition-specific verse table is embedded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, maximumAyah } = request;
  const compute = (): Output => {
    H.integer(maximumAyah, 1);
    const match = /^([1-9]\d*):([1-9]\d*)(?:-([1-9]\d*))?(?![\s\S])/.exec(
      reference,
    );
    H.domain(match);
    const surah = Number(match[1]),
      firstAyah = Number(match[2]),
      lastAyah = Number(match[3] ?? match[2]);
    H.integer(surah, 1, 114);
    H.integer(firstAyah, 1, maximumAyah);
    H.integer(lastAyah, firstAyah, maximumAyah);
    return { surah, firstAyah, lastAyah, count: lastAyah - firstAyah + 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "2:255-257", maximumAyah: 286 },
  output: { surah: 2, firstAyah: 255, lastAyah: 257, count: 3 },
} satisfies ToolExample<Input, Output>;
export const quranSurahAyahRangeParserTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/quran-surah-ayah-range-parser",
    title: "Quran Surah Ayah Range Parser Tool",
    description:
      "Parse an ASCII surah:ayah[-ayah] inclusive reference with a caller-supplied verse-count bound; no edition-specific verse table is embedded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reference: { type: "string", maxLength: 8192 },
        maximumAyah: { type: "integer", minimum: 1 },
      },
      required: ["reference", "maximumAyah"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surah: { type: "integer" },
        firstAyah: { type: "integer" },
        lastAyah: { type: "integer" },
        count: { type: "integer" },
      },
      required: ["surah", "firstAyah", "lastAyah", "count"],
    },
    ports: {
      inputs: [
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "maximumAyah",
          label: "Maximum Ayah",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "surah", label: "Surah", valueType: { type: "integer" } },
        {
          id: "firstAyah",
          label: "First Ayah",
          valueType: { type: "integer" },
        },
        { id: "lastAyah", label: "Last Ayah", valueType: { type: "integer" } },
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = quranSurahAyahRangeParserTool.execute;
export default quranSurahAyahRangeParserTool;

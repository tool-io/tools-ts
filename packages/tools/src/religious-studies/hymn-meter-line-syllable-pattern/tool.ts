import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly suppliedLineSyllables: readonly number[] };
export type Output = {
  readonly meterPattern: string;
  readonly totalSyllables: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedLineSyllables: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["suppliedLineSyllables"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meterPattern: { type: "string", maxLength: 8192 },
    totalSyllables: { type: "integer" },
  },
  required: ["meterPattern", "totalSyllables"],
} as const;
/** Format explicitly supplied hymn line syllable counts as a dot-separated pattern without segmenting syllables or identifying a meter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedLineSyllables } = request;
  const compute = (): Output => {
    suppliedLineSyllables.forEach(
      (value) => (
        H.domain(
          Number.isSafeInteger(value) &&
            value >= 0 &&
            value <= Number.MAX_SAFE_INTEGER,
          "suppliedLineSyllables",
        ),
        value
      ),
    );
    return {
      meterPattern: suppliedLineSyllables.join("."),
      totalSyllables: Number(
        suppliedLineSyllables.reduce((sum, value) => sum + BigInt(value), 0n),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedLineSyllables: [8, 6, 8, 6] },
  output: { meterPattern: "8.6.8.6", totalSyllables: 28 },
} satisfies ToolExample<Input, Output>;
export const hymnMeterLineSyllablePatternTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["religious-studies", "religious studies", "humanities"],
      keywords: ["religious studies", "humanities"],
    },
    id: "religious-studies/hymn-meter-line-syllable-pattern",
    title: "Hymn Meter Line Syllable Pattern",
    description:
      "Format explicitly supplied hymn line syllable counts as a dot-separated pattern without segmenting syllables or identifying a meter.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedLineSyllables: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["suppliedLineSyllables"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meterPattern: { type: "string", maxLength: 8192 },
        totalSyllables: { type: "integer" },
      },
      required: ["meterPattern", "totalSyllables"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedLineSyllables",
          label: "Supplied Line Syllables",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "meterPattern",
          label: "Meter Pattern",
          valueType: { type: "string" },
        },
        {
          id: "totalSyllables",
          label: "Total Syllables",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = hymnMeterLineSyllablePatternTool.execute;
export default hymnMeterLineSyllablePatternTool;

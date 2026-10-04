import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly scalar: number };
export type Output = {
  readonly leadingIndex: number;
  readonly vowelIndex: number;
  readonly trailingIndex: number;
  readonly leading: string;
  readonly vowel: string;
  readonly trailing: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scalar: { type: "integer", minimum: 44032, maximum: 55203 } },
  required: ["scalar"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leadingIndex: { type: "integer" },
    vowelIndex: { type: "integer" },
    trailingIndex: { type: "integer" },
    leading: { type: "string", maxLength: 8192 },
    vowel: { type: "string", maxLength: 8192 },
    trailing: { type: "string", maxLength: 8192 },
  },
  required: [
    "leadingIndex",
    "vowelIndex",
    "trailingIndex",
    "leading",
    "vowel",
    "trailing",
  ],
} as const;
/** Calculate unicode hangul jamo syllable coordinate from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scalar } = request;
  const compute = (): Output => {
    H.integer(scalar, 44032, 55203);
    const s = scalar - 44032,
      leadingIndex = Math.floor(s / 588),
      vowelIndex = Math.floor((s % 588) / 28),
      trailingIndex = s % 28;
    return {
      leadingIndex,
      vowelIndex,
      trailingIndex,
      leading: String.fromCodePoint(4352 + leadingIndex),
      vowel: String.fromCodePoint(4449 + vowelIndex),
      trailing:
        trailingIndex === 0 ? "" : String.fromCodePoint(4519 + trailingIndex),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scalar: 44033 },
  output: {
    leadingIndex: 0,
    vowelIndex: 0,
    trailingIndex: 1,
    leading: "ᄀ",
    vowel: "ᅡ",
    trailing: "ᆨ",
  },
} satisfies ToolExample<Input, Output>;
export const unicodeHangulJamoSyllableCoordinateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "text/unicode-hangul-jamo-syllable-coordinate",
      title: "Unicode Hangul Jamo Syllable Coordinate Tool",
      description:
        "Calculate unicode hangul jamo syllable coordinate from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scalar: { type: "integer", minimum: 44032, maximum: 55203 },
        },
        required: ["scalar"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leadingIndex: { type: "integer" },
          vowelIndex: { type: "integer" },
          trailingIndex: { type: "integer" },
          leading: { type: "string", maxLength: 8192 },
          vowel: { type: "string", maxLength: 8192 },
          trailing: { type: "string", maxLength: 8192 },
        },
        required: [
          "leadingIndex",
          "vowelIndex",
          "trailingIndex",
          "leading",
          "vowel",
          "trailing",
        ],
      },
      ports: {
        inputs: [
          {
            id: "scalar",
            label: "Scalar",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "leadingIndex",
            label: "Leading Index",
            valueType: { type: "integer" },
          },
          {
            id: "vowelIndex",
            label: "Vowel Index",
            valueType: { type: "integer" },
          },
          {
            id: "trailingIndex",
            label: "Trailing Index",
            valueType: { type: "integer" },
          },
          { id: "leading", label: "Leading", valueType: { type: "string" } },
          { id: "vowel", label: "Vowel", valueType: { type: "string" } },
          { id: "trailing", label: "Trailing", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = unicodeHangulJamoSyllableCoordinateTool.execute;
export default unicodeHangulJamoSyllableCoordinateTool;

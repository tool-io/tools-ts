import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly verseNumber: number;
  readonly lineNumber: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verseNumber: { type: "integer", minimum: 1 },
    lineNumber: { type: "integer", minimum: 1 },
  },
  required: ["verseNumber", "lineNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format explicitly supplied one-based verse and line ordinals without assigning a poetic structure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { verseNumber, lineNumber } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(verseNumber) &&
        verseNumber >= 1 &&
        verseNumber <= Number.MAX_SAFE_INTEGER,
      "verseNumber",
    ),
      verseNumber);
    (H.domain(
      Number.isSafeInteger(lineNumber) &&
        lineNumber >= 1 &&
        lineNumber <= Number.MAX_SAFE_INTEGER,
      "lineNumber",
    ),
      lineNumber);
    return { label: "Verse " + verseNumber + ", line " + lineNumber };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { verseNumber: 3, lineNumber: 7 },
  output: { label: "Verse 3, line 7" },
} satisfies ToolExample<Input, Output>;
export const songVerseLineNumberTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["ethnomusicology", "arts and design"],
        keywords: ["ethnomusicology", "arts and design"],
      },
      id: "ethnomusicology/song-verse-line-number",
      title: "Song Verse Line Number",
      description:
        "Format explicitly supplied one-based verse and line ordinals without assigning a poetic structure.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          verseNumber: { type: "integer", minimum: 1 },
          lineNumber: { type: "integer", minimum: 1 },
        },
        required: ["verseNumber", "lineNumber"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "verseNumber",
            label: "Verse Number",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "lineNumber",
            label: "Line Number",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  },
);
export const run = songVerseLineNumberTool.execute;
export default songVerseLineNumberTool;

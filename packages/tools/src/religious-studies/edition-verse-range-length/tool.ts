import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstVerse: number;
  readonly lastVerse: number;
  readonly includeFirst: boolean;
  readonly includeLast: boolean;
};
export type Output = { readonly count: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVerse: { type: "integer", minimum: 1 },
    lastVerse: { type: "integer" },
    includeFirst: { type: "boolean" },
    includeLast: { type: "boolean" },
  },
  required: ["firstVerse", "lastVerse", "includeFirst", "includeLast"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" } },
  required: ["count"],
} as const;
/** Count integer verse indices in one supplied edition and chapter under explicit endpoint rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstVerse, lastVerse, includeFirst, includeLast } = request;
  const compute = (): Output => {
    H.integer(firstVerse, 1);
    H.integer(lastVerse, firstVerse);
    return {
      count: Math.max(
        0,
        lastVerse -
          firstVerse +
          1 -
          (includeFirst ? 0 : 1) -
          (includeLast || (lastVerse === firstVerse && !includeFirst) ? 0 : 1),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstVerse: 3, lastVerse: 8, includeFirst: true, includeLast: true },
  output: { count: 6 },
} satisfies ToolExample<Input, Output>;
export const editionVerseRangeLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/edition-verse-range-length",
    title: "Edition Verse Range Length Tool",
    description:
      "Count integer verse indices in one supplied edition and chapter under explicit endpoint rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstVerse: { type: "integer", minimum: 1 },
        lastVerse: { type: "integer" },
        includeFirst: { type: "boolean" },
        includeLast: { type: "boolean" },
      },
      required: ["firstVerse", "lastVerse", "includeFirst", "includeLast"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { count: { type: "integer" } },
      required: ["count"],
    },
    ports: {
      inputs: [
        {
          id: "firstVerse",
          label: "First Verse",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastVerse",
          label: "Last Verse",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeFirst",
          label: "Include First",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeLast",
          label: "Include Last",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = editionVerseRangeLengthTool.execute;
export default editionVerseRangeLengthTool;

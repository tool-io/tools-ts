import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beatsPerMinute: number;
  readonly countsPerPhrase: number;
  readonly phrases: number;
};
export type Output = { readonly beats: number; readonly seconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beatsPerMinute: { type: "number", exclusiveMinimum: 0 },
    countsPerPhrase: { type: "integer", minimum: 1 },
    phrases: { type: "integer", minimum: 0 },
  },
  required: ["beatsPerMinute", "countsPerPhrase", "phrases"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { beats: { type: "integer" }, seconds: { type: "number" } },
  required: ["beats", "seconds"],
} as const;
/** One count equals one tempo beat; subdivisions must be converted by the caller. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beatsPerMinute, countsPerPhrase, phrases } = request;
  const compute = (): Output => {
    H.positive(beatsPerMinute);
    H.integer(countsPerPhrase, 1);
    H.integer(phrases, 0);
    return {
      beats: countsPerPhrase * phrases,
      seconds: (60 * countsPerPhrase * phrases) / beatsPerMinute,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beatsPerMinute: 120, countsPerPhrase: 8, phrases: 4 },
  output: { beats: 32, seconds: 16 },
} satisfies ToolExample<Input, Output>;
export const danceTempoCountPhraseDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/dance-tempo-count-phrase-duration",
    title: "Dance Tempo Count Phrase Duration Tool",
    description:
      "One count equals one tempo beat; subdivisions must be converted by the caller.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beatsPerMinute: { type: "number", exclusiveMinimum: 0 },
        countsPerPhrase: { type: "integer", minimum: 1 },
        phrases: { type: "integer", minimum: 0 },
      },
      required: ["beatsPerMinute", "countsPerPhrase", "phrases"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { beats: { type: "integer" }, seconds: { type: "number" } },
      required: ["beats", "seconds"],
    },
    ports: {
      inputs: [
        {
          id: "beatsPerMinute",
          label: "Beats Per Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "countsPerPhrase",
          label: "Counts Per Phrase",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "phrases",
          label: "Phrases",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "beats", label: "Beats", valueType: { type: "integer" } },
        { id: "seconds", label: "Seconds", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = danceTempoCountPhraseDurationTool.execute;
export default danceTempoCountPhraseDurationTool;

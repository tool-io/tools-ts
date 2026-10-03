import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly events: number;
  readonly syllables: number;
  readonly words: number;
  readonly useSyllables: boolean;
  readonly base: number;
};
export type Output = { readonly denominator: number; readonly rate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    events: { type: "integer", minimum: 0 },
    syllables: { type: "integer", minimum: 1 },
    words: { type: "integer", minimum: 1 },
    useSyllables: { type: "boolean" },
    base: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["events", "syllables", "words", "useSyllables", "base"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "integer" }, rate: { type: "number" } },
  required: ["denominator", "rate"],
} as const;
/** Compute a supplied event rate under an explicit word or syllable denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { events, syllables, words, useSyllables, base } = request;
  const compute = (): Output => {
    H.integer(events, 0);
    H.integer(syllables, 1);
    H.integer(words, 1);
    H.positive(base);
    return {
      denominator: useSyllables ? syllables : words,
      rate: (events * base) / (useSyllables ? syllables : words),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    events: 6,
    syllables: 120,
    words: 80,
    useSyllables: true,
    base: 100,
  },
  output: { denominator: 120, rate: 5 },
} satisfies ToolExample<Input, Output>;
export const speechFluencyResearchEventDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "speech-therapy/speech-fluency-research-event-denominator",
      title: "Speech Fluency Research Event Denominator Tool",
      description:
        "Compute a supplied event rate under an explicit word or syllable denominator.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          events: { type: "integer", minimum: 0 },
          syllables: { type: "integer", minimum: 1 },
          words: { type: "integer", minimum: 1 },
          useSyllables: { type: "boolean" },
          base: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["events", "syllables", "words", "useSyllables", "base"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          rate: { type: "number" },
        },
        required: ["denominator", "rate"],
      },
      ports: {
        inputs: [
          {
            id: "events",
            label: "Events",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "syllables",
            label: "Syllables",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "words",
            label: "Words",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "useSyllables",
            label: "Use Syllables",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "base",
            label: "Base",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          { id: "rate", label: "Rate", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = speechFluencyResearchEventDenominatorTool.execute;
export default speechFluencyResearchEventDenominatorTool;

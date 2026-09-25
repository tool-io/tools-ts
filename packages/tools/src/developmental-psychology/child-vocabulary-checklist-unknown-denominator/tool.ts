import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly known: number;
  readonly absent: number;
  readonly unknown: number;
  readonly includeUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly knownFraction: number;
  readonly unknownFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    known: { type: "integer", minimum: 0 },
    absent: { type: "integer", minimum: 0 },
    unknown: { type: "integer", minimum: 0 },
    includeUnknown: { type: "boolean" },
  },
  required: ["known", "absent", "unknown", "includeUnknown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    knownFraction: { type: "number" },
    unknownFraction: { type: "number" },
  },
  required: ["denominator", "knownFraction", "unknownFraction"],
} as const;
/** Explicit item-status denominator policy, without an age-equivalent score or instrument norm lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { known, absent, unknown, includeUnknown } = request;
  const compute = (): Output => {
    H.integer(known, 0);
    H.integer(absent, 0);
    H.integer(unknown, 0);
    H.domain(known + absent > 0);
    return {
      denominator: known + absent + (includeUnknown ? unknown : 0),
      knownFraction: known / (known + absent + (includeUnknown ? unknown : 0)),
      unknownFraction: unknown / (known + absent + unknown),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { known: 30, absent: 10, unknown: 10, includeUnknown: false },
  output: { denominator: 40, knownFraction: 0.75, unknownFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const childVocabularyChecklistUnknownDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-psychology/child-vocabulary-checklist-unknown-denominator",
      title: "Child Vocabulary Checklist Unknown Denominator Tool",
      description:
        "Explicit item-status denominator policy, without an age-equivalent score or instrument norm lookup.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          known: { type: "integer", minimum: 0 },
          absent: { type: "integer", minimum: 0 },
          unknown: { type: "integer", minimum: 0 },
          includeUnknown: { type: "boolean" },
        },
        required: ["known", "absent", "unknown", "includeUnknown"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          knownFraction: { type: "number" },
          unknownFraction: { type: "number" },
        },
        required: ["denominator", "knownFraction", "unknownFraction"],
      },
      ports: {
        inputs: [
          {
            id: "known",
            label: "Known",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "absent",
            label: "Absent",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unknown",
            label: "Unknown",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "includeUnknown",
            label: "Include Unknown",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "knownFraction",
            label: "Known Fraction",
            valueType: { type: "number" },
          },
          {
            id: "unknownFraction",
            label: "Unknown Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = childVocabularyChecklistUnknownDenominatorTool.execute;
export default childVocabularyChecklistUnknownDenominatorTool;

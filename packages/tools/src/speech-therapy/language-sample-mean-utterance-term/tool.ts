import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counts: readonly number[];
  readonly excluded: readonly boolean[];
};
export type Output = {
  readonly includedUtterances: number;
  readonly includedUnits: number;
  readonly mean: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counts: { type: "array", maxItems: 256, items: { type: "integer" } },
    excluded: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["counts", "excluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includedUtterances: { type: "integer" },
    includedUnits: { type: "integer" },
    mean: { type: "number" },
  },
  required: ["includedUtterances", "includedUnits", "mean"],
} as const;
/** Mean caller-defined units per explicitly eligible utterance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counts, excluded } = request;
  const compute = (): Output => {
    H.sameLength(counts, excluded);
    H.domain(counts.every((x) => x >= 0) && excluded.some((x) => !x));
    return {
      includedUtterances: counts.filter((_, i) => !excluded[i]).length,
      includedUnits: counts.reduce((a, b, i) => a + (excluded[i] ? 0 : b), 0),
      mean:
        counts.reduce((a, b, i) => a + (excluded[i] ? 0 : b), 0) /
        counts.filter((_, i) => !excluded[i]).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { counts: [2, 4, 9], excluded: [false, false, true] },
  output: { includedUtterances: 2, includedUnits: 6, mean: 3 },
} satisfies ToolExample<Input, Output>;
export const languageSampleMeanUtteranceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/language-sample-mean-utterance-term",
    title: "Language Sample Mean Utterance Term Tool",
    description: "Mean caller-defined units per explicitly eligible utterance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        counts: { type: "array", maxItems: 256, items: { type: "integer" } },
        excluded: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["counts", "excluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        includedUtterances: { type: "integer" },
        includedUnits: { type: "integer" },
        mean: { type: "number" },
      },
      required: ["includedUtterances", "includedUnits", "mean"],
    },
    ports: {
      inputs: [
        {
          id: "counts",
          label: "Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "includedUtterances",
          label: "Included Utterances",
          valueType: { type: "integer" },
        },
        {
          id: "includedUnits",
          label: "Included Units",
          valueType: { type: "integer" },
        },
        { id: "mean", label: "Mean", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = languageSampleMeanUtteranceTermTool.execute;
export default languageSampleMeanUtteranceTermTool;

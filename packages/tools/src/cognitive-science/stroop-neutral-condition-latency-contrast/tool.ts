import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conditionMeanMilliseconds: number;
  readonly neutralMeanMilliseconds: number;
};
export type Output = { readonly conditionMinusNeutralMilliseconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionMeanMilliseconds: { type: "number", minimum: 0 },
    neutralMeanMilliseconds: { type: "number", minimum: 0 },
  },
  required: ["conditionMeanMilliseconds", "neutralMeanMilliseconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { conditionMinusNeutralMilliseconds: { type: "number" } },
  required: ["conditionMinusNeutralMilliseconds"],
} as const;
/** Compare supplied condition and neutral Stroop mean latencies without inferring a clinical or cognitive trait. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { conditionMeanMilliseconds, neutralMeanMilliseconds } = request;
  const compute = (): Output => {
    H.domain(
      conditionMeanMilliseconds >= 0 && neutralMeanMilliseconds >= 0,
      "conditionMeanMilliseconds",
    );
    return {
      conditionMinusNeutralMilliseconds:
        conditionMeanMilliseconds - neutralMeanMilliseconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { conditionMeanMilliseconds: 650, neutralMeanMilliseconds: 550 },
  output: { conditionMinusNeutralMilliseconds: 100 },
} satisfies ToolExample<Input, Output>;
export const stroopNeutralConditionLatencyContrastTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["cognitive-science", "cognitive science", "psychology"],
        keywords: ["cognitive science", "psychology"],
      },
      id: "cognitive-science/stroop-neutral-condition-latency-contrast",
      title: "Stroop Neutral Condition Latency Contrast",
      description:
        "Compare supplied condition and neutral Stroop mean latencies without inferring a clinical or cognitive trait.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conditionMeanMilliseconds: { type: "number", minimum: 0 },
          neutralMeanMilliseconds: { type: "number", minimum: 0 },
        },
        required: ["conditionMeanMilliseconds", "neutralMeanMilliseconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionMinusNeutralMilliseconds: { type: "number" } },
        required: ["conditionMinusNeutralMilliseconds"],
      },
      ports: {
        inputs: [
          {
            id: "conditionMeanMilliseconds",
            label: "Condition Mean Milliseconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "neutralMeanMilliseconds",
            label: "Neutral Mean Milliseconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "conditionMinusNeutralMilliseconds",
            label: "Condition Minus Neutral Milliseconds",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = stroopNeutralConditionLatencyContrastTool.execute;
export default stroopNeutralConditionLatencyContrastTool;

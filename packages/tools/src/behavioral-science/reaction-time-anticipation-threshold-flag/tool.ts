import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reactionTimeMilliseconds: number;
  readonly anticipationThresholdMilliseconds: number;
};
export type Output = {
  readonly flagged: boolean;
  readonly marginMilliseconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reactionTimeMilliseconds: { type: "number", minimum: 0 },
    anticipationThresholdMilliseconds: { type: "number", minimum: 0 },
  },
  required: ["reactionTimeMilliseconds", "anticipationThresholdMilliseconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flagged: { type: "boolean" },
    marginMilliseconds: { type: "number" },
  },
  required: ["flagged", "marginMilliseconds"],
} as const;
/** Compare recorded reaction time with a caller-selected strict anticipation cutoff without selecting an experimental exclusion rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reactionTimeMilliseconds, anticipationThresholdMilliseconds } =
    request;
  const compute = (): Output => {
    H.domain(
      reactionTimeMilliseconds >= 0 && anticipationThresholdMilliseconds >= 0,
      "reactionTimeMilliseconds",
    );
    return {
      flagged: reactionTimeMilliseconds < anticipationThresholdMilliseconds,
      marginMilliseconds:
        reactionTimeMilliseconds - anticipationThresholdMilliseconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reactionTimeMilliseconds: 80,
    anticipationThresholdMilliseconds: 100,
  },
  output: { flagged: true, marginMilliseconds: -20 },
} satisfies ToolExample<Input, Output>;
export const reactionTimeAnticipationThresholdFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["behavioral-science", "behavioral science", "psychology"],
        keywords: ["behavioral science", "psychology"],
      },
      id: "behavioral-science/reaction-time-anticipation-threshold-flag",
      title: "Reaction Time Anticipation Threshold Flag",
      description:
        "Compare recorded reaction time with a caller-selected strict anticipation cutoff without selecting an experimental exclusion rule.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reactionTimeMilliseconds: { type: "number", minimum: 0 },
          anticipationThresholdMilliseconds: { type: "number", minimum: 0 },
        },
        required: [
          "reactionTimeMilliseconds",
          "anticipationThresholdMilliseconds",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          flagged: { type: "boolean" },
          marginMilliseconds: { type: "number" },
        },
        required: ["flagged", "marginMilliseconds"],
      },
      ports: {
        inputs: [
          {
            id: "reactionTimeMilliseconds",
            label: "Reaction Time Milliseconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "anticipationThresholdMilliseconds",
            label: "Anticipation Threshold Milliseconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "flagged", label: "Flagged", valueType: { type: "boolean" } },
          {
            id: "marginMilliseconds",
            label: "Margin Milliseconds",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = reactionTimeAnticipationThresholdFlagTool.execute;
export default reactionTimeAnticipationThresholdFlagTool;

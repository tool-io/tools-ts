import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stimuli: readonly string[];
  readonly index: number;
  readonly lag: number;
};
export type Output = {
  readonly hasComparison: boolean;
  readonly target: boolean;
  readonly comparisonIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stimuli: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    index: { type: "integer", minimum: 0 },
    lag: { type: "integer", minimum: 1 },
  },
  required: ["stimuli", "index", "lag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hasComparison: { type: "boolean" },
    target: { type: "boolean" },
    comparisonIndex: { type: "integer" },
  },
  required: ["hasComparison", "target", "comparisonIndex"],
} as const;
/** Check an exact symbol match to the n-back comparison item at one indexed trial, keeping initial no-comparison trials separate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stimuli, index, lag } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(index) && index >= 0 && index <= stimuli.length - 1,
      "index",
    ),
      index);
    (H.domain(
      Number.isSafeInteger(lag) && lag >= 1 && lag <= Number.MAX_SAFE_INTEGER,
      "lag",
    ),
      lag);
    const hasComparison = index >= lag;
    return {
      hasComparison,
      target: hasComparison && stimuli[index] === stimuli[index - lag],
      comparisonIndex: hasComparison ? index - lag : -1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stimuli: ["A", "B", "A", "C"], index: 2, lag: 2 },
  output: { hasComparison: true, target: true, comparisonIndex: 0 },
} satisfies ToolExample<Input, Output>;
export const nbackSingleTrialTargetFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cognitive-science", "cognitive science", "psychology"],
      keywords: ["cognitive science", "psychology"],
    },
    id: "cognitive-science/n-back-single-trial-target-flag",
    title: "N-Back Single Trial Target Flag",
    description:
      "Check an exact symbol match to the n-back comparison item at one indexed trial, keeping initial no-comparison trials separate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stimuli: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        index: { type: "integer", minimum: 0 },
        lag: { type: "integer", minimum: 1 },
      },
      required: ["stimuli", "index", "lag"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hasComparison: { type: "boolean" },
        target: { type: "boolean" },
        comparisonIndex: { type: "integer" },
      },
      required: ["hasComparison", "target", "comparisonIndex"],
    },
    ports: {
      inputs: [
        {
          id: "stimuli",
          label: "Stimuli",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lag",
          label: "Lag",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "hasComparison",
          label: "Has Comparison",
          valueType: { type: "boolean" },
        },
        { id: "target", label: "Target", valueType: { type: "boolean" } },
        {
          id: "comparisonIndex",
          label: "Comparison Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = nbackSingleTrialTargetFlagTool.execute;
export default nbackSingleTrialTargetFlagTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly threshold: number;
  readonly equalityPositive: boolean;
  readonly higherPositive: boolean;
};
export type Output = { readonly positive: boolean; readonly tied: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    threshold: { type: "number" },
    equalityPositive: { type: "boolean" },
    higherPositive: { type: "boolean" },
  },
  required: ["score", "threshold", "equalityPositive", "higherPositive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { positive: { type: "boolean" }, tied: { type: "boolean" } },
  required: ["positive", "tied"],
} as const;
/** Calculate positive label threshold tie from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, threshold, equalityPositive, higherPositive } = request;
  const compute = (): Output => {
    const d = (score - threshold) * (higherPositive ? 1 : -1);
    return {
      positive: d > 0 || (d === 0 && equalityPositive),
      tied: score === threshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    score: 0.5,
    threshold: 0.5,
    equalityPositive: true,
    higherPositive: true,
  },
  output: { positive: true, tied: true },
} satisfies ToolExample<Input, Output>;
export const positiveLabelThresholdTieTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/positive-label-threshold-tie",
    title: "Positive Label Threshold Tie Tool",
    description:
      "Calculate positive label threshold tie from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        threshold: { type: "number" },
        equalityPositive: { type: "boolean" },
        higherPositive: { type: "boolean" },
      },
      required: ["score", "threshold", "equalityPositive", "higherPositive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { positive: { type: "boolean" }, tied: { type: "boolean" } },
      required: ["positive", "tied"],
    },
    ports: {
      inputs: [
        {
          id: "score",
          label: "Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityPositive",
          label: "Equality Positive",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "higherPositive",
          label: "Higher Positive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "positive", label: "Positive", valueType: { type: "boolean" } },
        { id: "tied", label: "Tied", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = positiveLabelThresholdTieTool.execute;
export default positiveLabelThresholdTieTool;

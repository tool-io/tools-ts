import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly scores: readonly number[] };
export type Output = {
  readonly winner: number;
  readonly runnerUp: number;
  readonly margin: number;
  readonly tie: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scores: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["scores"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    winner: { type: "integer" },
    runnerUp: { type: "integer" },
    margin: { type: "number" },
    tie: { type: "boolean" },
  },
  required: ["winner", "runnerUp", "margin", "tie"],
} as const;
/** Calculate predicted class margin runner up from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scores } = request;
  const compute = (): Output => {
    H.domain(scores.length >= 2);
    const order = scores
        .map((_, i) => i)
        .sort((a, b) => scores[b] - scores[a] || a - b),
      winner = order[0],
      runnerUp = order[1],
      margin = scores[winner] - scores[runnerUp];
    return { winner, runnerUp, margin, tie: margin === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scores: [0.2, 0.7, 0.4] },
  output: { winner: 1, runnerUp: 2, margin: 0.29999999999999993, tie: false },
} satisfies ToolExample<Input, Output>;
export const predictedClassMarginRunnerUpTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/predicted-class-margin-runner-up",
    title: "Predicted Class Margin Runner Up Tool",
    description:
      "Calculate predicted class margin runner up from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scores: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["scores"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        winner: { type: "integer" },
        runnerUp: { type: "integer" },
        margin: { type: "number" },
        tie: { type: "boolean" },
      },
      required: ["winner", "runnerUp", "margin", "tie"],
    },
    ports: {
      inputs: [
        {
          id: "scores",
          label: "Scores",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "winner", label: "Winner", valueType: { type: "integer" } },
        { id: "runnerUp", label: "Runner Up", valueType: { type: "integer" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        { id: "tie", label: "Tie", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = predictedClassMarginRunnerUpTool.execute;
export default predictedClassMarginRunnerUpTool;

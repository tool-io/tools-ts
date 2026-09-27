import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
};
export type Output = {
  readonly opponentFirstProbability: number;
  readonly validProbability: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "number" },
    b: { type: "number" },
    c: { type: "number" },
    d: { type: "number" },
  },
  required: ["a", "b", "c", "d"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opponentFirstProbability: { type: "number" },
    validProbability: { type: "boolean" },
  },
  required: ["opponentFirstProbability", "validProbability"],
} as const;
/** Solve q*a+(1-q)*b=q*c+(1-q)*d; a degenerate indifference equation is rejected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { a, b, c, d } = request;
  const compute = (): Output => {
    H.domain(a - b - c + d !== 0);
    return {
      opponentFirstProbability: (d - b) / (a - b - c + d),
      validProbability:
        (d - b) / (a - b - c + d) >= 0 && (d - b) / (a - b - c + d) <= 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { a: 4, b: 0, c: 1, d: 3 },
  output: { opponentFirstProbability: 0.5, validProbability: true },
} satisfies ToolExample<Input, Output>;
export const mixedStrategyTwoActionIndifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/mixed-strategy-two-action-indifference",
    title: "Mixed Strategy Two Action Indifference Tool",
    description:
      "Solve q*a+(1-q)*b=q*c+(1-q)*d; a degenerate indifference equation is rejected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        a: { type: "number" },
        b: { type: "number" },
        c: { type: "number" },
        d: { type: "number" },
      },
      required: ["a", "b", "c", "d"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opponentFirstProbability: { type: "number" },
        validProbability: { type: "boolean" },
      },
      required: ["opponentFirstProbability", "validProbability"],
    },
    ports: {
      inputs: [
        { id: "a", label: "A", required: true, valueType: { type: "number" } },
        { id: "b", label: "B", required: true, valueType: { type: "number" } },
        { id: "c", label: "C", required: true, valueType: { type: "number" } },
        { id: "d", label: "D", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        {
          id: "opponentFirstProbability",
          label: "Opponent First Probability",
          valueType: { type: "number" },
        },
        {
          id: "validProbability",
          label: "Valid Probability",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = mixedStrategyTwoActionIndifferenceTool.execute;
export default mixedStrategyTwoActionIndifferenceTool;

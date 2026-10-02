import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly lower: number;
  readonly upper: number;
  readonly reversed: boolean;
};
export type Output = {
  readonly midpoint: number;
  readonly orientedScore: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    reversed: { type: "boolean" },
  },
  required: ["score", "lower", "upper", "reversed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    midpoint: { type: "number" },
    orientedScore: { type: "number" },
  },
  required: ["midpoint", "orientedScore"],
} as const;
/** Orient a supplied bounded research item without producing a validated psychiatric score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, lower, upper, reversed } = request;
  const compute = (): Output => {
    H.domain(lower <= upper && score >= lower && score <= upper);
    return {
      midpoint: lower / 2 + upper / 2,
      orientedScore: reversed ? lower + (upper - score) : score,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 2, lower: 1, upper: 5, reversed: true },
  output: { midpoint: 3, orientedScore: 4 },
} satisfies ToolExample<Input, Output>;
export const researchItemPolarityMidpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/research-item-polarity-midpoint",
    title: "Research Item Polarity Midpoint Tool",
    description:
      "Orient a supplied bounded research item without producing a validated psychiatric score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
        reversed: { type: "boolean" },
      },
      required: ["score", "lower", "upper", "reversed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midpoint: { type: "number" },
        orientedScore: { type: "number" },
      },
      required: ["midpoint", "orientedScore"],
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
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reversed",
          label: "Reversed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
        {
          id: "orientedScore",
          label: "Oriented Score",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchItemPolarityMidpointTool.execute;
export default researchItemPolarityMidpointTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly lower: number;
  readonly upper: number;
};
export type Output = { readonly midpoint: number; readonly reversed: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["score", "lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { midpoint: { type: "number" }, reversed: { type: "number" } },
  required: ["midpoint", "reversed"],
} as const;
/** Reverse an explicitly bounded research item without asserting a validated scale score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, lower, upper } = request;
  const compute = (): Output => {
    H.domain(lower <= upper && score >= lower && score <= upper);
    return {
      midpoint: lower / 2 + upper / 2,
      reversed: lower + (upper - score),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 2, lower: 1, upper: 5 },
  output: { midpoint: 3, reversed: 4 },
} satisfies ToolExample<Input, Output>;
export const scaleReverseItemMidpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/scale-reverse-item-midpoint",
    title: "Scale Reverse Item Midpoint Tool",
    description:
      "Reverse an explicitly bounded research item without asserting a validated scale score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["score", "lower", "upper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midpoint: { type: "number" },
        reversed: { type: "number" },
      },
      required: ["midpoint", "reversed"],
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
      ],
      outputs: [
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
        { id: "reversed", label: "Reversed", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = scaleReverseItemMidpointTool.execute;
export default scaleReverseItemMidpointTool;

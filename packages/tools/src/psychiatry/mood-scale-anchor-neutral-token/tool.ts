import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly lower: number;
  readonly neutral: number;
  readonly upper: number;
};
export type Output = {
  readonly side: string;
  readonly distanceFromNeutral: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    lower: { type: "number" },
    neutral: { type: "number" },
    upper: { type: "number" },
  },
  required: ["value", "lower", "neutral", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    side: { type: "string", maxLength: 8192 },
    distanceFromNeutral: { type: "number" },
  },
  required: ["side", "distanceFromNeutral"],
} as const;
/** Compare a supplied research response to an explicit neutral anchor; no validated mood scale is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, lower, neutral, upper } = request;
  const compute = (): Output => {
    H.domain(
      lower < neutral && neutral < upper && value >= lower && value <= upper,
    );
    return {
      side: value < neutral ? "below" : value > neutral ? "above" : "neutral",
      distanceFromNeutral: value - neutral,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 6, lower: 0, neutral: 5, upper: 10 },
  output: { side: "above", distanceFromNeutral: 1 },
} satisfies ToolExample<Input, Output>;
export const moodScaleAnchorNeutralTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/mood-scale-anchor-neutral-token",
    title: "Mood Scale Anchor Neutral Token Tool",
    description:
      "Compare a supplied research response to an explicit neutral anchor; no validated mood scale is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        lower: { type: "number" },
        neutral: { type: "number" },
        upper: { type: "number" },
      },
      required: ["value", "lower", "neutral", "upper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        side: { type: "string", maxLength: 8192 },
        distanceFromNeutral: { type: "number" },
      },
      required: ["side", "distanceFromNeutral"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
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
          id: "neutral",
          label: "Neutral",
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
        { id: "side", label: "Side", valueType: { type: "string" } },
        {
          id: "distanceFromNeutral",
          label: "Distance From Neutral",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = moodScaleAnchorNeutralTokenTool.execute;
export default moodScaleAnchorNeutralTokenTool;

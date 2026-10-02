import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly ratio: number; readonly absoluteError: number };
export type Output = {
  readonly reciprocalLower: number;
  readonly reciprocalUpper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratio: { type: "number" },
    absoluteError: { type: "number", minimum: 0 },
  },
  required: ["ratio", "absoluteError"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reciprocalLower: { type: "number" },
    reciprocalUpper: { type: "number" },
  },
  required: ["reciprocalLower", "reciprocalUpper"],
} as const;
/** Invert a strictly positive closed ratio interval; no decimal display rounding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ratio, absoluteError } = request;
  const compute = (): Output => {
    H.domain(absoluteError >= 0 && ratio > absoluteError);
    return {
      reciprocalLower: 1 / (ratio + absoluteError),
      reciprocalUpper: 1 / (ratio - absoluteError),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ratio: 2, absoluteError: 0.5 },
  output: { reciprocalLower: 0.4, reciprocalUpper: 0.6666666666666666 },
} satisfies ToolExample<Input, Output>;
export const reciprocalRatioRoundingEnvelopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/reciprocal-ratio-rounding-envelope",
    title: "Reciprocal Ratio Rounding Envelope Tool",
    description:
      "Invert a strictly positive closed ratio interval; no decimal display rounding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratio: { type: "number" },
        absoluteError: { type: "number", minimum: 0 },
      },
      required: ["ratio", "absoluteError"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reciprocalLower: { type: "number" },
        reciprocalUpper: { type: "number" },
      },
      required: ["reciprocalLower", "reciprocalUpper"],
    },
    ports: {
      inputs: [
        {
          id: "ratio",
          label: "Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "absoluteError",
          label: "Absolute Error",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reciprocalLower",
          label: "Reciprocal Lower",
          valueType: { type: "number" },
        },
        {
          id: "reciprocalUpper",
          label: "Reciprocal Upper",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reciprocalRatioRoundingEnvelopeTool.execute;
export default reciprocalRatioRoundingEnvelopeTool;

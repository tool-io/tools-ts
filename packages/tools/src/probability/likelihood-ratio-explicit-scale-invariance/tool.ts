import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly scale: number;
};
export type Output = { readonly ratio: number; readonly scaledRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number", exclusiveMinimum: 0 },
    second: { type: "number", exclusiveMinimum: 0 },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["first", "second", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" }, scaledRatio: { type: "number" } },
  required: ["ratio", "scaledRatio"],
} as const;
/** Calculate likelihood ratio explicit scale invariance from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second, scale } = input;
  const compute = (): Output => {
    H.positive(first);
    H.positive(second);
    H.positive(scale);
    return {
      ratio: first / second,
      scaledRatio: (first * scale) / (second * scale),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 2, second: 4, scale: 3 },
  output: { ratio: 0.5, scaledRatio: 0.5 },
} satisfies ToolExample<Input, Output>;
export const likelihoodRatioExplicitScaleInvarianceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "probability/likelihood-ratio-explicit-scale-invariance",
      title: "Likelihood Ratio Explicit Scale Invariance Tool",
      description:
        "Calculate likelihood ratio explicit scale invariance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "number", exclusiveMinimum: 0 },
          second: { type: "number", exclusiveMinimum: 0 },
          scale: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["first", "second", "scale"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ratio: { type: "number" },
          scaledRatio: { type: "number" },
        },
        required: ["ratio", "scaledRatio"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scale",
            label: "Scale",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "ratio", label: "Ratio", valueType: { type: "number" } },
          {
            id: "scaledRatio",
            label: "Scaled Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = likelihoodRatioExplicitScaleInvarianceTool.execute;
export default likelihoodRatioExplicitScaleInvarianceTool;

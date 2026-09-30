import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly quantile: number };
export type Output = { readonly lower: number; readonly upper: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { quantile: { type: "number", minimum: 0, maximum: 1 } },
  required: ["quantile"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lower: { type: "number" }, upper: { type: "number" } },
  required: ["lower", "upper"],
} as const;
/** Return the pinball-loss subgradient interval with respect to the residual at exactly zero. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { quantile } = input;
  const compute = (): Output => {
    H.probability(quantile);
    return { lower: quantile - 1, upper: quantile };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { quantile: 0.25 },
  output: { lower: -0.75, upper: 0.25 },
} satisfies ToolExample<Input, Output>;
export const quantileLossZeroResidualSubgradientTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "metrics/quantile-loss-zero-residual-subgradient",
      title: "Quantile Loss Zero Residual Subgradient Tool",
      description:
        "Return the pinball-loss subgradient interval with respect to the residual at exactly zero.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { quantile: { type: "number", minimum: 0, maximum: 1 } },
        required: ["quantile"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { lower: { type: "number" }, upper: { type: "number" } },
        required: ["lower", "upper"],
      },
      ports: {
        inputs: [
          {
            id: "quantile",
            label: "Quantile",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "lower", label: "Lower", valueType: { type: "number" } },
          { id: "upper", label: "Upper", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = quantileLossZeroResidualSubgradientTool.execute;
export default quantileLossZeroResidualSubgradientTool;

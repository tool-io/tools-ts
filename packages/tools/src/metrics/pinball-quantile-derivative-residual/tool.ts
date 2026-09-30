import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly residual: number;
  readonly quantile: number;
  readonly zeroChoice: number;
};
export type Output = { readonly gradient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "number" },
    quantile: { type: "number", minimum: 0, maximum: 1 },
    zeroChoice: { type: "number" },
  },
  required: ["residual", "quantile", "zeroChoice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gradient: { type: "number" } },
  required: ["gradient"],
} as const;
/** Compute pinball quantile derivative residual from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { residual, quantile, zeroChoice } = input;
  const compute = (): Output => {
    probability(quantile);
    domain(zeroChoice >= -quantile && zeroChoice <= 1 - quantile);
    return {
      gradient:
        residual > 0 ? -quantile : residual < 0 ? 1 - quantile : zeroChoice,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { residual: 2, quantile: 0.75, zeroChoice: 0 },
  output: { gradient: -0.75 },
} satisfies ToolExample<Input, Output>;
export const pinballQuantileDerivativeResidualTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "metrics/pinball-quantile-derivative-residual",
  title: "Pinball Quantile Derivative Residual Tool",
  description:
    "Compute pinball quantile derivative residual from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "residual",
        label: "Residual",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "quantile",
        label: "Quantile",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "zeroChoice",
        label: "Zero Choice",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "gradient", label: "Gradient", valueType: { type: "number" } },
    ],
  },
});
export const run = pinballQuantileDerivativeResidualTool.execute;
export default pinballQuantileDerivativeResidualTool;

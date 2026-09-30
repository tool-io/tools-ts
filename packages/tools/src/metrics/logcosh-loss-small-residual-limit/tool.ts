import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly residual: number };
export type Output = {
  readonly quadraticApproximation: number;
  readonly quarticCorrection: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quadraticApproximation: { type: "number" },
    quarticCorrection: { type: "number" },
  },
  required: ["quadraticApproximation", "quarticCorrection"],
} as const;
/** Return the second- and fourth-order small-residual Taylor terms for log(cosh(residual)). */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { residual } = request;
  const compute = (): Output => {
    return {
      quadraticApproximation: (residual * residual) / 2,
      quarticCorrection: -(residual ** 4) / 12,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { residual: 0.2 },
  output: {
    quadraticApproximation: 0.020000000000000004,
    quarticCorrection: -0.00013333333333333337,
  },
} satisfies ToolExample<Input, Output>;
export const logcoshLossSmallResidualLimitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/logcosh-loss-small-residual-limit",
    title: "Logcosh Loss Small Residual Limit Tool",
    description:
      "Return the second- and fourth-order small-residual Taylor terms for log(cosh(residual)).",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residual: { type: "number" } },
      required: ["residual"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quadraticApproximation: { type: "number" },
        quarticCorrection: { type: "number" },
      },
      required: ["quadraticApproximation", "quarticCorrection"],
    },
    ports: {
      inputs: [
        {
          id: "residual",
          label: "Residual",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "quadraticApproximation",
          label: "Quadratic Approximation",
          valueType: { type: "number" },
        },
        {
          id: "quarticCorrection",
          label: "Quartic Correction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = logcoshLossSmallResidualLimitTool.execute;
export default logcoshLossSmallResidualLimitTool;

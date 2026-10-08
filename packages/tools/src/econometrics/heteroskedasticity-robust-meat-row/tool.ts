import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regressor: number;
  readonly residual: number;
  readonly analyticWeight: number;
};
export type Output = { readonly scalarMeatContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regressor: { type: "number" },
    residual: { type: "number" },
    analyticWeight: { type: "number", minimum: 0 },
  },
  required: ["regressor", "residual", "analyticWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scalarMeatContribution: { type: "number" } },
  required: ["scalarMeatContribution"],
} as const;
/** Square one explicit weighted score w*x*residual for the scalar HC0 sandwich meat contribution without a degrees-of-freedom correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regressor, residual, analyticWeight } = request;
  const compute = (): Output => {
    H.domain(analyticWeight >= 0, "analyticWeight");
    return {
      scalarMeatContribution: (analyticWeight * regressor * residual) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { regressor: 2, residual: 3, analyticWeight: 0.5 },
  output: { scalarMeatContribution: 9 },
} satisfies ToolExample<Input, Output>;
export const heteroskedasticityRobustMeatRowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/heteroskedasticity-robust-meat-row",
    title: "Heteroskedasticity Robust Meat Row Tool",
    description:
      "Square one explicit weighted score w*x*residual for the scalar HC0 sandwich meat contribution without a degrees-of-freedom correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regressor: { type: "number" },
        residual: { type: "number" },
        analyticWeight: { type: "number", minimum: 0 },
      },
      required: ["regressor", "residual", "analyticWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scalarMeatContribution: { type: "number" } },
      required: ["scalarMeatContribution"],
    },
    ports: {
      inputs: [
        {
          id: "regressor",
          label: "Regressor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "residual",
          label: "Residual",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "analyticWeight",
          label: "Analytic Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scalarMeatContribution",
          label: "Scalar Meat Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = heteroskedasticityRobustMeatRowTool.execute;
export default heteroskedasticityRobustMeatRowTool;

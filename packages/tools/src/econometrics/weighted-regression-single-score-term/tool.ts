import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regressor: number;
  readonly residual: number;
  readonly analyticWeight: number;
};
export type Output = { readonly scoreContribution: number };
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
  properties: { scoreContribution: { type: "number" } },
  required: ["scoreContribution"],
} as const;
/** Calculate one scalar weighted least-squares score contribution w*x*residual from explicit analytic weight and observations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regressor, residual, analyticWeight } = request;
  const compute = (): Output => {
    H.domain(analyticWeight >= 0, "analyticWeight");
    return { scoreContribution: analyticWeight * regressor * residual };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { regressor: 2, residual: 3, analyticWeight: 0.5 },
  output: { scoreContribution: 3 },
} satisfies ToolExample<Input, Output>;
export const weightedRegressionSingleScoreTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/weighted-regression-single-score-term",
    title: "Weighted Regression Single Score Term Tool",
    description:
      "Calculate one scalar weighted least-squares score contribution w*x*residual from explicit analytic weight and observations.",
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
      properties: { scoreContribution: { type: "number" } },
      required: ["scoreContribution"],
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
          id: "scoreContribution",
          label: "Score Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = weightedRegressionSingleScoreTermTool.execute;
export default weightedRegressionSingleScoreTermTool;

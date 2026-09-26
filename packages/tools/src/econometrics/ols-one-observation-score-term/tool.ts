import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regressor: number;
  readonly residual: number;
  readonly weight: number;
};
export type Output = {
  readonly score: number;
  readonly squaredResidualContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regressor: { type: "number" },
    residual: { type: "number" },
    weight: { type: "number", minimum: 0 },
  },
  required: ["regressor", "residual", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    squaredResidualContribution: { type: "number" },
  },
  required: ["score", "squaredResidualContribution"],
} as const;
/** One x*w*residual normal-equation contribution, omitting an arbitrary common factor of two. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regressor, residual, weight } = request;
  const compute = (): Output => {
    H.domain(weight >= 0);
    return {
      score: weight * regressor * residual,
      squaredResidualContribution: weight * residual ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { regressor: 2, residual: 3, weight: 0.5 },
  output: { score: 3, squaredResidualContribution: 4.5 },
} satisfies ToolExample<Input, Output>;
export const olsOneObservationScoreTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/ols-one-observation-score-term",
    title: "OLS One Observation Score Term Tool",
    description:
      "One x*w*residual normal-equation contribution, omitting an arbitrary common factor of two.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regressor: { type: "number" },
        residual: { type: "number" },
        weight: { type: "number", minimum: 0 },
      },
      required: ["regressor", "residual", "weight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        squaredResidualContribution: { type: "number" },
      },
      required: ["score", "squaredResidualContribution"],
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
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "score", label: "Score", valueType: { type: "number" } },
        {
          id: "squaredResidualContribution",
          label: "Squared Residual Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = olsOneObservationScoreTermTool.execute;
export default olsOneObservationScoreTermTool;

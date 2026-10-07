import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly velocityFluctuation: number;
  readonly scalarFluctuation: number;
};
export type Output = { readonly covarianceContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    velocityFluctuation: { type: "number" },
    scalarFluctuation: { type: "number" },
  },
  required: ["velocityFluctuation", "scalarFluctuation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { covarianceContribution: { type: "number" } },
  required: ["covarianceContribution"],
} as const;
/** Multiply supplied signed velocity and scalar fluctuations for one unaveraged turbulent covariance contribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { velocityFluctuation, scalarFluctuation } = request;
  const compute = (): Output => {
    return { covarianceContribution: velocityFluctuation * scalarFluctuation };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { velocityFluctuation: 2, scalarFluctuation: -3 },
  output: { covarianceContribution: -6 },
} satisfies ToolExample<Input, Output>;
export const turbulentFluxInstantaneousCovarianceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["atmospheric-physics", "atmospheric physics", "physics"],
        keywords: ["atmospheric physics", "physics"],
      },
      id: "atmospheric-physics/turbulent-flux-instantaneous-covariance-term",
      title: "Turbulent Flux Instantaneous Covariance Term",
      description:
        "Multiply supplied signed velocity and scalar fluctuations for one unaveraged turbulent covariance contribution.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          velocityFluctuation: { type: "number" },
          scalarFluctuation: { type: "number" },
        },
        required: ["velocityFluctuation", "scalarFluctuation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { covarianceContribution: { type: "number" } },
        required: ["covarianceContribution"],
      },
      ports: {
        inputs: [
          {
            id: "velocityFluctuation",
            label: "Velocity Fluctuation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scalarFluctuation",
            label: "Scalar Fluctuation",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "covarianceContribution",
            label: "Covariance Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = turbulentFluxInstantaneousCovarianceTermTool.execute;
export default turbulentFluxInstantaneousCovarianceTermTool;

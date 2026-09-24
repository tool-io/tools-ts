import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly presentCurvatureContribution: number;
  readonly redshift: number;
};
export type Output = { readonly factor: number; readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentCurvatureContribution: { type: "number" },
    redshift: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["presentCurvatureContribution", "redshift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "number" }, contribution: { type: "number" } },
  required: ["factor", "contribution"],
} as const;
/** Signed curvature contribution to a dimensionless Friedmann expansion function; this is not a material energy density. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { presentCurvatureContribution, redshift } = request;
  const compute = (): Output => {
    H.domain(redshift > -1);
    return {
      factor: (1 + redshift) ** 2,
      contribution: presentCurvatureContribution * (1 + redshift) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { presentCurvatureContribution: -0.1, redshift: 1 },
  output: { factor: 4, contribution: -0.4 },
} satisfies ToolExample<Input, Output>;
export const curvatureDensityRedshiftSquareTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/curvature-density-redshift-square-term",
    title: "Curvature Density Redshift Square Term Tool",
    description:
      "Signed curvature contribution to a dimensionless Friedmann expansion function; this is not a material energy density.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presentCurvatureContribution: { type: "number" },
        redshift: { type: "number", exclusiveMinimum: -1 },
      },
      required: ["presentCurvatureContribution", "redshift"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        factor: { type: "number" },
        contribution: { type: "number" },
      },
      required: ["factor", "contribution"],
    },
    ports: {
      inputs: [
        {
          id: "presentCurvatureContribution",
          label: "Present Curvature Contribution",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "redshift",
          label: "Redshift",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "factor", label: "Factor", valueType: { type: "number" } },
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = curvatureDensityRedshiftSquareTermTool.execute;
export default curvatureDensityRedshiftSquareTermTool;

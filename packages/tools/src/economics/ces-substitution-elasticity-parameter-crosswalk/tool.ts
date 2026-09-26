import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rho: number };
export type Output = { readonly elasticity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rho: { type: "number", exclusiveMaximum: 1 } },
  required: ["rho"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elasticity: { type: "number" } },
  required: ["elasticity"],
} as const;
/** Use the CES power parameterization (a*x^rho+b*y^rho)^(1/rho), including the rho=0 limiting elasticity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rho } = request;
  const compute = (): Output => {
    H.domain(rho < 1);
    return { elasticity: 1 / (1 - rho) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rho: 0.5 },
  output: { elasticity: 2 },
} satisfies ToolExample<Input, Output>;
export const cesSubstitutionElasticityParameterCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economics/ces-substitution-elasticity-parameter-crosswalk",
      title: "Ces Substitution Elasticity Parameter Crosswalk Tool",
      description:
        "Use the CES power parameterization (a*x^rho+b*y^rho)^(1/rho), including the rho=0 limiting elasticity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { rho: { type: "number", exclusiveMaximum: 1 } },
        required: ["rho"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { elasticity: { type: "number" } },
        required: ["elasticity"],
      },
      ports: {
        inputs: [
          {
            id: "rho",
            label: "Rho",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "elasticity",
            label: "Elasticity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cesSubstitutionElasticityParameterCrosswalkTool.execute;
export default cesSubstitutionElasticityParameterCrosswalkTool;

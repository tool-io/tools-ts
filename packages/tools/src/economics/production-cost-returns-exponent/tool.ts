import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outputScale: number;
  readonly costScale: number;
};
export type Output = {
  readonly elasticity: number;
  readonly superlinear: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outputScale: { type: "number", exclusiveMinimum: 0 },
    costScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["outputScale", "costScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elasticity: { type: "number" },
    superlinear: { type: "boolean" },
  },
  required: ["elasticity", "superlinear"],
} as const;
/** Two-point power-law cost exponent from supplied multiplicative output and cost factors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outputScale, costScale } = request;
  const compute = (): Output => {
    H.domain(outputScale > 0 && outputScale !== 1 && costScale > 0);
    return {
      elasticity: Math.log(costScale) / Math.log(outputScale),
      superlinear: Math.log(costScale) / Math.log(outputScale) > 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outputScale: 2, costScale: 4 },
  output: { elasticity: 2, superlinear: true },
} satisfies ToolExample<Input, Output>;
export const productionCostReturnsExponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/production-cost-returns-exponent",
    title: "Production Cost Returns Exponent Tool",
    description:
      "Two-point power-law cost exponent from supplied multiplicative output and cost factors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outputScale: { type: "number", exclusiveMinimum: 0 },
        costScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["outputScale", "costScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elasticity: { type: "number" },
        superlinear: { type: "boolean" },
      },
      required: ["elasticity", "superlinear"],
    },
    ports: {
      inputs: [
        {
          id: "outputScale",
          label: "Output Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "costScale",
          label: "Cost Scale",
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
        {
          id: "superlinear",
          label: "Superlinear",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = productionCostReturnsExponentTool.execute;
export default productionCostReturnsExponentTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly marginalProductFirst: number;
  readonly marginalProductSecond: number;
};
export type Output = {
  readonly slope: number;
  readonly opportunityCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marginalProductFirst: { type: "number", exclusiveMinimum: 0 },
    marginalProductSecond: { type: "number", minimum: 0 },
  },
  required: ["marginalProductFirst", "marginalProductSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slope: { type: "number" },
    opportunityCost: { type: "number" },
  },
  required: ["slope", "opportunityCost"],
} as const;
/** For a resource shift producing dX=MP_first*dR and dY=-MP_second*dR, return dY/dX. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { marginalProductFirst, marginalProductSecond } = request;
  const compute = (): Output => {
    H.positive(marginalProductFirst);
    H.domain(marginalProductSecond >= 0);
    return {
      slope: -marginalProductSecond / marginalProductFirst,
      opportunityCost: marginalProductSecond / marginalProductFirst,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { marginalProductFirst: 3, marginalProductSecond: 6 },
  output: { slope: -2, opportunityCost: 2 },
} satisfies ToolExample<Input, Output>;
export const productionPossibilityFrontierLocalSlopeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economics/production-possibility-frontier-local-slope",
      title: "Production Possibility Frontier Local Slope Tool",
      description:
        "For a resource shift producing dX=MP_first*dR and dY=-MP_second*dR, return dY/dX.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          marginalProductFirst: { type: "number", exclusiveMinimum: 0 },
          marginalProductSecond: { type: "number", minimum: 0 },
        },
        required: ["marginalProductFirst", "marginalProductSecond"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          slope: { type: "number" },
          opportunityCost: { type: "number" },
        },
        required: ["slope", "opportunityCost"],
      },
      ports: {
        inputs: [
          {
            id: "marginalProductFirst",
            label: "Marginal Product First",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "marginalProductSecond",
            label: "Marginal Product Second",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "slope", label: "Slope", valueType: { type: "number" } },
          {
            id: "opportunityCost",
            label: "Opportunity Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = productionPossibilityFrontierLocalSlopeTool.execute;
export default productionPossibilityFrontierLocalSlopeTool;

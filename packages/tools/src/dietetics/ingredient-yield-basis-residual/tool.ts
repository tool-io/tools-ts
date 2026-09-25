import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawMass: number;
  readonly suppliedYieldFraction: number;
  readonly measuredPreparedMass: number;
};
export type Output = {
  readonly expectedPreparedMass: number;
  readonly residual: number;
  readonly measuredYield: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawMass: { type: "number", exclusiveMinimum: 0 },
    suppliedYieldFraction: { type: "number", minimum: 0 },
    measuredPreparedMass: { type: "number", minimum: 0 },
  },
  required: ["rawMass", "suppliedYieldFraction", "measuredPreparedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedPreparedMass: { type: "number" },
    residual: { type: "number" },
    measuredYield: { type: "number" },
  },
  required: ["expectedPreparedMass", "residual", "measuredYield"],
} as const;
/** Compare supplied and measured preparation yields, allowing mass gains; no nutrient retention model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawMass, suppliedYieldFraction, measuredPreparedMass } = request;
  const compute = (): Output => {
    H.positive(rawMass);
    H.domain(suppliedYieldFraction >= 0 && measuredPreparedMass >= 0);
    return {
      expectedPreparedMass: rawMass * suppliedYieldFraction,
      residual: measuredPreparedMass - rawMass * suppliedYieldFraction,
      measuredYield: measuredPreparedMass / rawMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rawMass: 100, suppliedYieldFraction: 0.8, measuredPreparedMass: 75 },
  output: { expectedPreparedMass: 80, residual: -5, measuredYield: 0.75 },
} satisfies ToolExample<Input, Output>;
export const ingredientYieldBasisResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/ingredient-yield-basis-residual",
    title: "Ingredient Yield Basis Residual Tool",
    description:
      "Compare supplied and measured preparation yields, allowing mass gains; no nutrient retention model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawMass: { type: "number", exclusiveMinimum: 0 },
        suppliedYieldFraction: { type: "number", minimum: 0 },
        measuredPreparedMass: { type: "number", minimum: 0 },
      },
      required: ["rawMass", "suppliedYieldFraction", "measuredPreparedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedPreparedMass: { type: "number" },
        residual: { type: "number" },
        measuredYield: { type: "number" },
      },
      required: ["expectedPreparedMass", "residual", "measuredYield"],
    },
    ports: {
      inputs: [
        {
          id: "rawMass",
          label: "Raw Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedYieldFraction",
          label: "Supplied Yield Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredPreparedMass",
          label: "Measured Prepared Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedPreparedMass",
          label: "Expected Prepared Mass",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "measuredYield",
          label: "Measured Yield",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ingredientYieldBasisResidualTool.execute;
export default ingredientYieldBasisResidualTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outputElasticity: number;
  readonly observedFactorIncome: number;
  readonly totalIncome: number;
};
export type Output = { readonly observedShare: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outputElasticity: { type: "number" },
    observedFactorIncome: { type: "number", minimum: 0 },
    totalIncome: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["outputElasticity", "observedFactorIncome", "totalIncome"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { observedShare: { type: "number" }, gap: { type: "number" } },
  required: ["observedShare", "gap"],
} as const;
/** Compare an observed income share with a supplied Cobb-Douglas elasticity without assuming profit-maximization conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outputElasticity, observedFactorIncome, totalIncome } = request;
  const compute = (): Output => {
    H.positive(totalIncome);
    H.domain(observedFactorIncome >= 0);
    return {
      observedShare: observedFactorIncome / totalIncome,
      gap: observedFactorIncome / totalIncome - outputElasticity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outputElasticity: 0.3, observedFactorIncome: 40, totalIncome: 100 },
  output: { observedShare: 0.4, gap: 0.10000000000000003 },
} satisfies ToolExample<Input, Output>;
export const cobbDouglasShareReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/cobb-douglas-share-reference-gap",
    title: "Cobb Douglas Share Reference Gap Tool",
    description:
      "Compare an observed income share with a supplied Cobb-Douglas elasticity without assuming profit-maximization conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outputElasticity: { type: "number" },
        observedFactorIncome: { type: "number", minimum: 0 },
        totalIncome: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["outputElasticity", "observedFactorIncome", "totalIncome"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedShare: { type: "number" },
        gap: { type: "number" },
      },
      required: ["observedShare", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "outputElasticity",
          label: "Output Elasticity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedFactorIncome",
          label: "Observed Factor Income",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalIncome",
          label: "Total Income",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedShare",
          label: "Observed Share",
          valueType: { type: "number", unit: "1" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cobbDouglasShareReferenceGapTool.execute;
export default cobbDouglasShareReferenceGapTool;

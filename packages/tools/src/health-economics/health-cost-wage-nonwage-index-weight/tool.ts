import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseCost: number;
  readonly wageShare: number;
  readonly wageIndexRatio: number;
  readonly nonwageIndexRatio: number;
};
export type Output = {
  readonly weightedIndex: number;
  readonly updatedCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseCost: { type: "number" },
    wageShare: { type: "number", minimum: 0, maximum: 1 },
    wageIndexRatio: { type: "number", exclusiveMinimum: 0 },
    nonwageIndexRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["baseCost", "wageShare", "wageIndexRatio", "nonwageIndexRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedIndex: { type: "number" },
    updatedCost: { type: "number" },
  },
  required: ["weightedIndex", "updatedCost"],
} as const;
/** Calculate health cost wage nonwage index weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseCost, wageShare, wageIndexRatio, nonwageIndexRatio } = request;
  const compute = (): Output => {
    H.probability(wageShare);
    H.positive(wageIndexRatio);
    H.positive(nonwageIndexRatio);
    return {
      weightedIndex:
        wageShare * wageIndexRatio + (1 - wageShare) * nonwageIndexRatio,
      updatedCost:
        baseCost *
        (wageShare * wageIndexRatio + (1 - wageShare) * nonwageIndexRatio),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baseCost: 1000,
    wageShare: 0.6,
    wageIndexRatio: 1.2,
    nonwageIndexRatio: 1.1,
  },
  output: {
    weightedIndex: 1.1600000000000001,
    updatedCost: 1160.0000000000002,
  },
} satisfies ToolExample<Input, Output>;
export const healthCostWageNonwageIndexWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/health-cost-wage-nonwage-index-weight",
    title: "Health Cost Wage Nonwage Index Weight Tool",
    description:
      "Calculate health cost wage nonwage index weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseCost: { type: "number" },
        wageShare: { type: "number", minimum: 0, maximum: 1 },
        wageIndexRatio: { type: "number", exclusiveMinimum: 0 },
        nonwageIndexRatio: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "baseCost",
        "wageShare",
        "wageIndexRatio",
        "nonwageIndexRatio",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedIndex: { type: "number" },
        updatedCost: { type: "number" },
      },
      required: ["weightedIndex", "updatedCost"],
    },
    ports: {
      inputs: [
        {
          id: "baseCost",
          label: "Base Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wageShare",
          label: "Wage Share",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wageIndexRatio",
          label: "Wage Index Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nonwageIndexRatio",
          label: "Nonwage Index Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedIndex",
          label: "Weighted Index",
          valueType: { type: "number" },
        },
        {
          id: "updatedCost",
          label: "Updated Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = healthCostWageNonwageIndexWeightTool.execute;
export default healthCostWageNonwageIndexWeightTool;

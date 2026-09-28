import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalIncome: number;
  readonly nominalCost: number;
  readonly incomeIndex: number;
  readonly costIndex: number;
  readonly baseIncomeIndex: number;
  readonly baseCostIndex: number;
};
export type Output = {
  readonly realIncome: number;
  readonly realCost: number;
  readonly realSurplus: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalIncome: { type: "number" },
    nominalCost: { type: "number" },
    incomeIndex: { type: "number", exclusiveMinimum: 0 },
    costIndex: { type: "number", exclusiveMinimum: 0 },
    baseIncomeIndex: { type: "number", exclusiveMinimum: 0 },
    baseCostIndex: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "nominalIncome",
    "nominalCost",
    "incomeIndex",
    "costIndex",
    "baseIncomeIndex",
    "baseCostIndex",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    realIncome: { type: "number" },
    realCost: { type: "number" },
    realSurplus: { type: "number" },
  },
  required: ["realIncome", "realCost", "realSurplus"],
} as const;
/** Separate deflation of income and costs into explicitly matched base-period purchasing-power units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    nominalIncome,
    nominalCost,
    incomeIndex,
    costIndex,
    baseIncomeIndex,
    baseCostIndex,
  } = request;
  const compute = (): Output => {
    H.positive(incomeIndex);
    H.positive(costIndex);
    H.positive(baseIncomeIndex);
    H.positive(baseCostIndex);
    return {
      realIncome: (nominalIncome * baseIncomeIndex) / incomeIndex,
      realCost: (nominalCost * baseCostIndex) / costIndex,
      realSurplus:
        (nominalIncome * baseIncomeIndex) / incomeIndex -
        (nominalCost * baseCostIndex) / costIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nominalIncome: 2400,
    nominalCost: 1800,
    incomeIndex: 120,
    costIndex: 125,
    baseIncomeIndex: 100,
    baseCostIndex: 100,
  },
  output: { realIncome: 2000, realCost: 1440, realSurplus: 560 },
} satisfies ToolExample<Input, Output>;
export const retirementResourceRealValueIndexTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gerontology/retirement-resource-real-value-index-term",
      title: "Retirement Resource Real Value Index Term Tool",
      description:
        "Separate deflation of income and costs into explicitly matched base-period purchasing-power units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nominalIncome: { type: "number" },
          nominalCost: { type: "number" },
          incomeIndex: { type: "number", exclusiveMinimum: 0 },
          costIndex: { type: "number", exclusiveMinimum: 0 },
          baseIncomeIndex: { type: "number", exclusiveMinimum: 0 },
          baseCostIndex: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "nominalIncome",
          "nominalCost",
          "incomeIndex",
          "costIndex",
          "baseIncomeIndex",
          "baseCostIndex",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          realIncome: { type: "number" },
          realCost: { type: "number" },
          realSurplus: { type: "number" },
        },
        required: ["realIncome", "realCost", "realSurplus"],
      },
      ports: {
        inputs: [
          {
            id: "nominalIncome",
            label: "Nominal Income",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nominalCost",
            label: "Nominal Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "incomeIndex",
            label: "Income Index",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "costIndex",
            label: "Cost Index",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "baseIncomeIndex",
            label: "Base Income Index",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "baseCostIndex",
            label: "Base Cost Index",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "realIncome",
            label: "Real Income",
            valueType: { type: "number" },
          },
          { id: "realCost", label: "Real Cost", valueType: { type: "number" } },
          {
            id: "realSurplus",
            label: "Real Surplus",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = retirementResourceRealValueIndexTermTool.execute;
export default retirementResourceRealValueIndexTermTool;

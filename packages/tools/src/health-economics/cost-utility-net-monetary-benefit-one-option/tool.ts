import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cost: number;
  readonly qalys: number;
  readonly valuePerQaly: number;
  readonly comparatorCost: number;
  readonly comparatorQalys: number;
};
export type Output = {
  readonly netBenefit: number;
  readonly incrementalNetBenefit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cost: { type: "number" },
    qalys: { type: "number" },
    valuePerQaly: { type: "number" },
    comparatorCost: { type: "number" },
    comparatorQalys: { type: "number" },
  },
  required: [
    "cost",
    "qalys",
    "valuePerQaly",
    "comparatorCost",
    "comparatorQalys",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netBenefit: { type: "number" },
    incrementalNetBenefit: { type: "number" },
  },
  required: ["netBenefit", "incrementalNetBenefit"],
} as const;
/** Net monetary benefit using an explicit threshold in matched currency/QALY units; no threshold or funding recommendation is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cost, qalys, valuePerQaly, comparatorCost, comparatorQalys } =
    request;
  const compute = (): Output => {
    return {
      netBenefit: qalys * valuePerQaly - cost,
      incrementalNetBenefit:
        (qalys - comparatorQalys) * valuePerQaly - cost + comparatorCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cost: 20000,
    qalys: 2,
    valuePerQaly: 30000,
    comparatorCost: 10000,
    comparatorQalys: 1.5,
  },
  output: { netBenefit: 40000, incrementalNetBenefit: 5000 },
} satisfies ToolExample<Input, Output>;
export const costUtilityNetMonetaryBenefitOneOptionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-economics/cost-utility-net-monetary-benefit-one-option",
      title: "Cost Utility Net Monetary Benefit One Option Tool",
      description:
        "Net monetary benefit using an explicit threshold in matched currency/QALY units; no threshold or funding recommendation is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cost: { type: "number" },
          qalys: { type: "number" },
          valuePerQaly: { type: "number" },
          comparatorCost: { type: "number" },
          comparatorQalys: { type: "number" },
        },
        required: [
          "cost",
          "qalys",
          "valuePerQaly",
          "comparatorCost",
          "comparatorQalys",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netBenefit: { type: "number" },
          incrementalNetBenefit: { type: "number" },
        },
        required: ["netBenefit", "incrementalNetBenefit"],
      },
      ports: {
        inputs: [
          {
            id: "cost",
            label: "Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "qalys",
            label: "Qalys",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "valuePerQaly",
            label: "Value Per Qaly",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "comparatorCost",
            label: "Comparator Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "comparatorQalys",
            label: "Comparator Qalys",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netBenefit",
            label: "Net Benefit",
            valueType: { type: "number" },
          },
          {
            id: "incrementalNetBenefit",
            label: "Incremental Net Benefit",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = costUtilityNetMonetaryBenefitOneOptionTool.execute;
export default costUtilityNetMonetaryBenefitOneOptionTool;

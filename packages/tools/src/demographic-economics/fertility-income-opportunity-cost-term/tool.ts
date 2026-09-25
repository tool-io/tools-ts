import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly foregoneHours: number;
  readonly hourlyEarnings: number;
  readonly retainedEarningsFraction: number;
  readonly childcareCost: number;
  readonly benefit: number;
};
export type Output = {
  readonly foregoneIncome: number;
  readonly netCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foregoneHours: { type: "number", minimum: 0 },
    hourlyEarnings: { type: "number", minimum: 0 },
    retainedEarningsFraction: { type: "number", minimum: 0, maximum: 1 },
    childcareCost: { type: "number", minimum: 0 },
    benefit: { type: "number", minimum: 0 },
  },
  required: [
    "foregoneHours",
    "hourlyEarnings",
    "retainedEarningsFraction",
    "childcareCost",
    "benefit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foregoneIncome: { type: "number" },
    netCost: { type: "number" },
  },
  required: ["foregoneIncome", "netCost"],
} as const;
/** Explicit household cost accounting, without predicting fertility choices or selecting benefits policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    foregoneHours,
    hourlyEarnings,
    retainedEarningsFraction,
    childcareCost,
    benefit,
  } = request;
  const compute = (): Output => {
    H.domain(
      foregoneHours >= 0 &&
        hourlyEarnings >= 0 &&
        childcareCost >= 0 &&
        benefit >= 0,
    );
    H.probability(retainedEarningsFraction);
    return {
      foregoneIncome:
        foregoneHours * hourlyEarnings * (1 - retainedEarningsFraction),
      netCost:
        foregoneHours * hourlyEarnings * (1 - retainedEarningsFraction) +
        childcareCost -
        benefit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    foregoneHours: 100,
    hourlyEarnings: 20,
    retainedEarningsFraction: 0.25,
    childcareCost: 500,
    benefit: 100,
  },
  output: { foregoneIncome: 1500, netCost: 1900 },
} satisfies ToolExample<Input, Output>;
export const fertilityIncomeOpportunityCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/fertility-income-opportunity-cost-term",
    title: "Fertility Income Opportunity Cost Term Tool",
    description:
      "Explicit household cost accounting, without predicting fertility choices or selecting benefits policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        foregoneHours: { type: "number", minimum: 0 },
        hourlyEarnings: { type: "number", minimum: 0 },
        retainedEarningsFraction: { type: "number", minimum: 0, maximum: 1 },
        childcareCost: { type: "number", minimum: 0 },
        benefit: { type: "number", minimum: 0 },
      },
      required: [
        "foregoneHours",
        "hourlyEarnings",
        "retainedEarningsFraction",
        "childcareCost",
        "benefit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        foregoneIncome: { type: "number" },
        netCost: { type: "number" },
      },
      required: ["foregoneIncome", "netCost"],
    },
    ports: {
      inputs: [
        {
          id: "foregoneHours",
          label: "Foregone Hours",
          required: true,
          valueType: { type: "number", unit: "h" },
        },
        {
          id: "hourlyEarnings",
          label: "Hourly Earnings",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retainedEarningsFraction",
          label: "Retained Earnings Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "childcareCost",
          label: "Childcare Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "benefit",
          label: "Benefit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "foregoneIncome",
          label: "Foregone Income",
          valueType: { type: "number" },
        },
        { id: "netCost", label: "Net Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fertilityIncomeOpportunityCostTermTool.execute;
export default fertilityIncomeOpportunityCostTermTool;

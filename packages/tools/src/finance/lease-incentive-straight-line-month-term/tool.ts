import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly incentive: number; readonly months: number };
export type Output = { readonly monthlyReduction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incentive: { type: "number" },
    months: { type: "integer", minimum: 1 },
  },
  required: ["incentive", "months"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { monthlyReduction: { type: "number" } },
  required: ["monthlyReduction"],
} as const;
/** Calculate lease incentive straight line month term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { incentive, months } = request;
  const compute = (): Output => {
    H.integer(months, 1);
    return { monthlyReduction: incentive / months };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { incentive: 2400, months: 24 },
  output: { monthlyReduction: 100 },
} satisfies ToolExample<Input, Output>;
export const leaseIncentiveStraightLineMonthTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "finance/lease-incentive-straight-line-month-term",
      title: "Lease Incentive Straight Line Month Term Tool",
      description:
        "Calculate lease incentive straight line month term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          incentive: { type: "number" },
          months: { type: "integer", minimum: 1 },
        },
        required: ["incentive", "months"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { monthlyReduction: { type: "number" } },
        required: ["monthlyReduction"],
      },
      ports: {
        inputs: [
          {
            id: "incentive",
            label: "Incentive",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "months",
            label: "Months",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "monthlyReduction",
            label: "Monthly Reduction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = leaseIncentiveStraightLineMonthTermTool.execute;
export default leaseIncentiveStraightLineMonthTermTool;

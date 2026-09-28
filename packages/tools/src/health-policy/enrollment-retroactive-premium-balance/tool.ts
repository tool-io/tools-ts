import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly months: number;
  readonly monthlyPremium: number;
  readonly paid: number;
  readonly subsidyPerMonth: number;
  readonly lateFee: number;
};
export type Output = {
  readonly grossPremium: number;
  readonly subsidy: number;
  readonly balance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    months: { type: "integer", minimum: 0 },
    monthlyPremium: { type: "number", minimum: 0 },
    paid: { type: "number", minimum: 0 },
    subsidyPerMonth: { type: "number", minimum: 0 },
    lateFee: { type: "number", minimum: 0 },
  },
  required: ["months", "monthlyPremium", "paid", "subsidyPerMonth", "lateFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossPremium: { type: "number" },
    subsidy: { type: "number" },
    balance: { type: "number" },
  },
  required: ["grossPremium", "subsidy", "balance"],
} as const;
/** Calculate enrollment retroactive premium balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { months, monthlyPremium, paid, subsidyPerMonth, lateFee } = request;
  const compute = (): Output => {
    H.integer(months, 0);
    H.domain(
      monthlyPremium >= 0 && paid >= 0 && subsidyPerMonth >= 0 && lateFee >= 0,
    );
    return {
      grossPremium: months * monthlyPremium,
      subsidy: months * subsidyPerMonth,
      balance: months * (monthlyPremium - subsidyPerMonth) + lateFee - paid,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    months: 3,
    monthlyPremium: 100,
    paid: 150,
    subsidyPerMonth: 20,
    lateFee: 10,
  },
  output: { grossPremium: 300, subsidy: 60, balance: 100 },
} satisfies ToolExample<Input, Output>;
export const enrollmentRetroactivePremiumBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-policy/enrollment-retroactive-premium-balance",
      title: "Enrollment Retroactive Premium Balance Tool",
      description:
        "Calculate enrollment retroactive premium balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          months: { type: "integer", minimum: 0 },
          monthlyPremium: { type: "number", minimum: 0 },
          paid: { type: "number", minimum: 0 },
          subsidyPerMonth: { type: "number", minimum: 0 },
          lateFee: { type: "number", minimum: 0 },
        },
        required: [
          "months",
          "monthlyPremium",
          "paid",
          "subsidyPerMonth",
          "lateFee",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossPremium: { type: "number" },
          subsidy: { type: "number" },
          balance: { type: "number" },
        },
        required: ["grossPremium", "subsidy", "balance"],
      },
      ports: {
        inputs: [
          {
            id: "months",
            label: "Months",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "monthlyPremium",
            label: "Monthly Premium",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "paid",
            label: "Paid",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "subsidyPerMonth",
            label: "Subsidy Per Month",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lateFee",
            label: "Late Fee",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "grossPremium",
            label: "Gross Premium",
            valueType: { type: "number" },
          },
          { id: "subsidy", label: "Subsidy", valueType: { type: "number" } },
          { id: "balance", label: "Balance", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = enrollmentRetroactivePremiumBalanceTool.execute;
export default enrollmentRetroactivePremiumBalanceTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly enrolledDays: number;
  readonly daysInMonth: number;
  readonly monthlyRate: number;
  readonly riskWeight: number;
  readonly adjustment: number;
};
export type Output = {
  readonly monthShare: number;
  readonly weightedPayment: number;
  readonly totalPayment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enrolledDays: { type: "integer", minimum: 0 },
    daysInMonth: { type: "integer", minimum: 1, maximum: 31 },
    monthlyRate: { type: "number", minimum: 0 },
    riskWeight: { type: "number", minimum: 0 },
    adjustment: { type: "number" },
  },
  required: [
    "enrolledDays",
    "daysInMonth",
    "monthlyRate",
    "riskWeight",
    "adjustment",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    monthShare: { type: "number" },
    weightedPayment: { type: "number" },
    totalPayment: { type: "number" },
  },
  required: ["monthShare", "weightedPayment", "totalPayment"],
} as const;
/** Calculate provider payment capitation month term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { enrolledDays, daysInMonth, monthlyRate, riskWeight, adjustment } =
    request;
  const compute = (): Output => {
    H.integer(daysInMonth, 1, 31);
    H.integer(enrolledDays, 0, daysInMonth);
    H.domain(monthlyRate >= 0 && riskWeight >= 0);
    return {
      monthShare: enrolledDays / daysInMonth,
      weightedPayment: (monthlyRate * riskWeight * enrolledDays) / daysInMonth,
      totalPayment:
        (monthlyRate * riskWeight * enrolledDays) / daysInMonth + adjustment,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    enrolledDays: 15,
    daysInMonth: 30,
    monthlyRate: 100,
    riskWeight: 1.2,
    adjustment: 5,
  },
  output: { monthShare: 0.5, weightedPayment: 60, totalPayment: 65 },
} satisfies ToolExample<Input, Output>;
export const providerPaymentCapitationMonthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/provider-payment-capitation-month-term",
    title: "Provider Payment Capitation Month Term Tool",
    description:
      "Calculate provider payment capitation month term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enrolledDays: { type: "integer", minimum: 0 },
        daysInMonth: { type: "integer", minimum: 1, maximum: 31 },
        monthlyRate: { type: "number", minimum: 0 },
        riskWeight: { type: "number", minimum: 0 },
        adjustment: { type: "number" },
      },
      required: [
        "enrolledDays",
        "daysInMonth",
        "monthlyRate",
        "riskWeight",
        "adjustment",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        monthShare: { type: "number" },
        weightedPayment: { type: "number" },
        totalPayment: { type: "number" },
      },
      required: ["monthShare", "weightedPayment", "totalPayment"],
    },
    ports: {
      inputs: [
        {
          id: "enrolledDays",
          label: "Enrolled Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "daysInMonth",
          label: "Days In Month",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "monthlyRate",
          label: "Monthly Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "riskWeight",
          label: "Risk Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "adjustment",
          label: "Adjustment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "monthShare",
          label: "Month Share",
          valueType: { type: "number" },
        },
        {
          id: "weightedPayment",
          label: "Weighted Payment",
          valueType: { type: "number" },
        },
        {
          id: "totalPayment",
          label: "Total Payment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = providerPaymentCapitationMonthTermTool.execute;
export default providerPaymentCapitationMonthTermTool;

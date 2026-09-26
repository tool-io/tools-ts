import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cash: number;
  readonly restrictedCash: number;
  readonly committedPayments: number;
  readonly monthlyNetBurn: number;
};
export type Output = {
  readonly availableCash: number;
  readonly runwayMonths: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cash: { type: "number", minimum: 0 },
    restrictedCash: { type: "number", minimum: 0 },
    committedPayments: { type: "number", minimum: 0 },
    monthlyNetBurn: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["cash", "restrictedCash", "committedPayments", "monthlyNetBurn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableCash: { type: "number" },
    runwayMonths: { type: "number" },
  },
  required: ["availableCash", "runwayMonths"],
} as const;
/** Static cash runway after explicit reserves and commitments, assuming constant positive net burn. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cash, restrictedCash, committedPayments, monthlyNetBurn } = request;
  const compute = (): Output => {
    H.domain(
      cash >= 0 &&
        restrictedCash >= 0 &&
        committedPayments >= 0 &&
        restrictedCash <= cash,
    );
    H.positive(monthlyNetBurn);
    return {
      availableCash: cash - restrictedCash - committedPayments,
      runwayMonths:
        (cash - restrictedCash - committedPayments) / monthlyNetBurn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cash: 200000,
    restrictedCash: 20000,
    committedPayments: 30000,
    monthlyNetBurn: 25000,
  },
  output: { availableCash: 150000, runwayMonths: 6 },
} satisfies ToolExample<Input, Output>;
export const startupRunwayCommittedCashAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "entrepreneurship-studies/startup-runway-committed-cash-adjustment",
      title: "Startup Runway Committed Cash Adjustment Tool",
      description:
        "Static cash runway after explicit reserves and commitments, assuming constant positive net burn.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cash: { type: "number", minimum: 0 },
          restrictedCash: { type: "number", minimum: 0 },
          committedPayments: { type: "number", minimum: 0 },
          monthlyNetBurn: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "cash",
          "restrictedCash",
          "committedPayments",
          "monthlyNetBurn",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          availableCash: { type: "number" },
          runwayMonths: { type: "number" },
        },
        required: ["availableCash", "runwayMonths"],
      },
      ports: {
        inputs: [
          {
            id: "cash",
            label: "Cash",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "restrictedCash",
            label: "Restricted Cash",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "committedPayments",
            label: "Committed Payments",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "monthlyNetBurn",
            label: "Monthly Net Burn",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "availableCash",
            label: "Available Cash",
            valueType: { type: "number" },
          },
          {
            id: "runwayMonths",
            label: "Runway Months",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = startupRunwayCommittedCashAdjustmentTool.execute;
export default startupRunwayCommittedCashAdjustmentTool;

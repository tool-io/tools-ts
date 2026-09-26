import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashInvestment: number;
  readonly programFee: number;
  readonly equityFraction: number;
};
export type Output = {
  readonly netCash: number;
  readonly grossPostMoney: number;
  readonly netCashPerEquity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashInvestment: { type: "number", minimum: 0 },
    programFee: { type: "number", minimum: 0 },
    equityFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["cashInvestment", "programFee", "equityFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netCash: { type: "number" },
    grossPostMoney: { type: "number" },
    netCashPerEquity: { type: "number" },
  },
  required: ["netCash", "grossPostMoney", "netCashPerEquity"],
} as const;
/** Cash-per-equity diagnostics; the net-cash ratio does not appraise noncash accelerator services. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashInvestment, programFee, equityFraction } = request;
  const compute = (): Output => {
    H.domain(
      cashInvestment >= 0 &&
        programFee >= 0 &&
        programFee <= cashInvestment &&
        equityFraction > 0 &&
        equityFraction <= 1,
    );
    return {
      netCash: cashInvestment - programFee,
      grossPostMoney: cashInvestment / equityFraction,
      netCashPerEquity: (cashInvestment - programFee) / equityFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cashInvestment: 100000, programFee: 20000, equityFraction: 0.05 },
  output: {
    netCash: 80000,
    grossPostMoney: 2000000,
    netCashPerEquity: 1600000,
  },
} satisfies ToolExample<Input, Output>;
export const acceleratorEquityFeeImpliedValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/accelerator-equity-fee-implied-value",
    title: "Accelerator Equity Fee Implied Value Tool",
    description:
      "Cash-per-equity diagnostics; the net-cash ratio does not appraise noncash accelerator services.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashInvestment: { type: "number", minimum: 0 },
        programFee: { type: "number", minimum: 0 },
        equityFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["cashInvestment", "programFee", "equityFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netCash: { type: "number" },
        grossPostMoney: { type: "number" },
        netCashPerEquity: { type: "number" },
      },
      required: ["netCash", "grossPostMoney", "netCashPerEquity"],
    },
    ports: {
      inputs: [
        {
          id: "cashInvestment",
          label: "Cash Investment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "programFee",
          label: "Program Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equityFraction",
          label: "Equity Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netCash", label: "Net Cash", valueType: { type: "number" } },
        {
          id: "grossPostMoney",
          label: "Gross Post Money",
          valueType: { type: "number" },
        },
        {
          id: "netCashPerEquity",
          label: "Net Cash Per Equity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = acceleratorEquityFeeImpliedValueTool.execute;
export default acceleratorEquityFeeImpliedValueTool;

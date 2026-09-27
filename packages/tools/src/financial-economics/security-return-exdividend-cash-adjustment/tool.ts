import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialPrice: number;
  readonly finalExDividendPrice: number;
  readonly dividend: number;
  readonly reinvested: boolean;
  readonly reinvestPrice: number;
};
export type Output = {
  readonly cashTotalReturn: number;
  readonly finalWealth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialPrice: { type: "number", exclusiveMinimum: 0 },
    finalExDividendPrice: { type: "number", minimum: 0 },
    dividend: { type: "number", minimum: 0 },
    reinvested: { type: "boolean" },
    reinvestPrice: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "initialPrice",
    "finalExDividendPrice",
    "dividend",
    "reinvested",
    "reinvestPrice",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashTotalReturn: { type: "number" },
    finalWealth: { type: "number" },
  },
  required: ["cashTotalReturn", "finalWealth"],
} as const;
/** Single dividend cash return and optional terminal wealth after reinvesting the dividend at an explicitly supplied price. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    initialPrice,
    finalExDividendPrice,
    dividend,
    reinvested,
    reinvestPrice,
  } = request;
  const compute = (): Output => {
    H.positive(initialPrice);
    H.domain(finalExDividendPrice >= 0 && dividend >= 0);
    H.positive(reinvestPrice);
    return {
      cashTotalReturn:
        (finalExDividendPrice + dividend - initialPrice) / initialPrice,
      finalWealth: reinvested
        ? finalExDividendPrice * (1 + dividend / reinvestPrice)
        : finalExDividendPrice + dividend,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialPrice: 100,
    finalExDividendPrice: 102,
    dividend: 3,
    reinvested: false,
    reinvestPrice: 100,
  },
  output: { cashTotalReturn: 0.05, finalWealth: 105 },
} satisfies ToolExample<Input, Output>;
export const securityReturnExdividendCashAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "financial-economics/security-return-exdividend-cash-adjustment",
      title: "Security Return Exdividend Cash Adjustment Tool",
      description:
        "Single dividend cash return and optional terminal wealth after reinvesting the dividend at an explicitly supplied price.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialPrice: { type: "number", exclusiveMinimum: 0 },
          finalExDividendPrice: { type: "number", minimum: 0 },
          dividend: { type: "number", minimum: 0 },
          reinvested: { type: "boolean" },
          reinvestPrice: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "initialPrice",
          "finalExDividendPrice",
          "dividend",
          "reinvested",
          "reinvestPrice",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cashTotalReturn: { type: "number" },
          finalWealth: { type: "number" },
        },
        required: ["cashTotalReturn", "finalWealth"],
      },
      ports: {
        inputs: [
          {
            id: "initialPrice",
            label: "Initial Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalExDividendPrice",
            label: "Final Ex Dividend Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dividend",
            label: "Dividend",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reinvested",
            label: "Reinvested",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "reinvestPrice",
            label: "Reinvest Price",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "cashTotalReturn",
            label: "Cash Total Return",
            valueType: { type: "number" },
          },
          {
            id: "finalWealth",
            label: "Final Wealth",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = securityReturnExdividendCashAdjustmentTool.execute;
export default securityReturnExdividendCashAdjustmentTool;

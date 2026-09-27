import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossReturn: number;
  readonly feeFractionPerPeriod: number;
  readonly periods: number;
};
export type Output = {
  readonly netGrossReturn: number;
  readonly effectiveFeeSpread: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossReturn: { type: "number", minimum: 0 },
    feeFractionPerPeriod: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    periods: { type: "integer", minimum: 0 },
  },
  required: ["grossReturn", "feeFractionPerPeriod", "periods"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netGrossReturn: { type: "number" },
    effectiveFeeSpread: { type: "number" },
  },
  required: ["netGrossReturn", "effectiveFeeSpread"],
} as const;
/** Apply repeated supplied proportional fees to a gross return without a fee schedule or investment recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossReturn, feeFractionPerPeriod, periods } = request;
  const compute = (): Output => {
    H.domain(
      grossReturn >= 0 && feeFractionPerPeriod >= 0 && feeFractionPerPeriod < 1,
    );
    H.integer(periods, 0);
    return {
      netGrossReturn: grossReturn * (1 - feeFractionPerPeriod) ** periods,
      effectiveFeeSpread:
        grossReturn * -Math.expm1(periods * Math.log1p(-feeFractionPerPeriod)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossReturn: 1.1, feeFractionPerPeriod: 0.1, periods: 2 },
  output: {
    netGrossReturn: 0.8910000000000001,
    effectiveFeeSpread: 0.20900000000000002,
  },
} satisfies ToolExample<Input, Output>;
export const compoundedFeeEffectiveSpreadTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/compounded-fee-effective-spread",
    title: "Compounded Fee Effective Spread Tool",
    description:
      "Apply repeated supplied proportional fees to a gross return without a fee schedule or investment recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossReturn: { type: "number", minimum: 0 },
        feeFractionPerPeriod: {
          type: "number",
          minimum: 0,
          exclusiveMaximum: 1,
        },
        periods: { type: "integer", minimum: 0 },
      },
      required: ["grossReturn", "feeFractionPerPeriod", "periods"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netGrossReturn: { type: "number" },
        effectiveFeeSpread: { type: "number" },
      },
      required: ["netGrossReturn", "effectiveFeeSpread"],
    },
    ports: {
      inputs: [
        {
          id: "grossReturn",
          label: "Gross Return",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "feeFractionPerPeriod",
          label: "Fee Fraction Per Period",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periods",
          label: "Periods",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "netGrossReturn",
          label: "Net Gross Return",
          valueType: { type: "number" },
        },
        {
          id: "effectiveFeeSpread",
          label: "Effective Fee Spread",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = compoundedFeeEffectiveSpreadTool.execute;
export default compoundedFeeEffectiveSpreadTool;

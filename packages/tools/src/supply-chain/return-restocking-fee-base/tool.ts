import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returnedGoodsValue: number;
  readonly excludedValue: number;
  readonly feeFraction: number;
};
export type Output = {
  readonly feeBase: number;
  readonly restockingFee: number;
  readonly netCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnedGoodsValue: { type: "number", minimum: 0 },
    excludedValue: { type: "number", minimum: 0 },
    feeFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["returnedGoodsValue", "excludedValue", "feeFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feeBase: { type: "number" },
    restockingFee: { type: "number" },
    netCredit: { type: "number" },
  },
  required: ["feeBase", "restockingFee", "netCredit"],
} as const;
/** Apply a caller-specified restocking fee to an explicitly reduced return-value base without selecting a returns policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returnedGoodsValue, excludedValue, feeFraction } = request;
  const compute = (): Output => {
    H.domain(
      returnedGoodsValue >= 0 &&
        excludedValue >= 0 &&
        excludedValue <= returnedGoodsValue,
      "returnedGoodsValue",
    );
    (H.domain(feeFraction >= 0 && feeFraction <= 1, "feeFraction"),
      feeFraction);
    return {
      feeBase: returnedGoodsValue - excludedValue,
      restockingFee: (returnedGoodsValue - excludedValue) * feeFraction,
      netCredit:
        returnedGoodsValue - (returnedGoodsValue - excludedValue) * feeFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { returnedGoodsValue: 100, excludedValue: 20, feeFraction: 0.1 },
  output: { feeBase: 80, restockingFee: 8, netCredit: 92 },
} satisfies ToolExample<Input, Output>;
export const returnRestockingFeeBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/return-restocking-fee-base",
    title: "Return Restocking Fee Base Tool",
    description:
      "Apply a caller-specified restocking fee to an explicitly reduced return-value base without selecting a returns policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnedGoodsValue: { type: "number", minimum: 0 },
        excludedValue: { type: "number", minimum: 0 },
        feeFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["returnedGoodsValue", "excludedValue", "feeFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feeBase: { type: "number" },
        restockingFee: { type: "number" },
        netCredit: { type: "number" },
      },
      required: ["feeBase", "restockingFee", "netCredit"],
    },
    ports: {
      inputs: [
        {
          id: "returnedGoodsValue",
          label: "Returned Goods Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedValue",
          label: "Excluded Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "feeFraction",
          label: "Fee Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "feeBase", label: "Fee Base", valueType: { type: "number" } },
        {
          id: "restockingFee",
          label: "Restocking Fee",
          valueType: { type: "number" },
        },
        { id: "netCredit", label: "Net Credit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = returnRestockingFeeBaseTool.execute;
export default returnRestockingFeeBaseTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amountMinor: number;
  readonly feeRate: number;
  readonly fixedMinor: number;
  readonly bookedFeeMinor: number;
};
export type Output = {
  readonly unroundedFee: number;
  readonly reserve: number;
  readonly netBookedMinor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amountMinor: { type: "integer", minimum: 0 },
    feeRate: { type: "number", minimum: 0 },
    fixedMinor: { type: "integer", minimum: 0 },
    bookedFeeMinor: { type: "integer", minimum: 0 },
  },
  required: ["amountMinor", "feeRate", "fixedMinor", "bookedFeeMinor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unroundedFee: { type: "number" },
    reserve: { type: "number" },
    netBookedMinor: { type: "integer" },
  },
  required: ["unroundedFee", "reserve", "netBookedMinor"],
} as const;
/** Expose an unrounded-minus-booked fee residual in supplied minor units; no exchange rate or fee schedule is chosen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amountMinor, feeRate, fixedMinor, bookedFeeMinor } = request;
  const compute = (): Output => {
    H.integer(amountMinor, 0);
    H.integer(fixedMinor, 0);
    H.integer(bookedFeeMinor, 0);
    H.domain(feeRate >= 0);
    return {
      unroundedFee: amountMinor * feeRate + fixedMinor,
      reserve: amountMinor * feeRate + fixedMinor - bookedFeeMinor,
      netBookedMinor: amountMinor - bookedFeeMinor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    amountMinor: 1001,
    feeRate: 0.025,
    fixedMinor: 10,
    bookedFeeMinor: 35,
  },
  output: {
    unroundedFee: 35.025000000000006,
    reserve: 0.025000000000005684,
    netBookedMinor: 966,
  },
} satisfies ToolExample<Input, Output>;
export const crossBorderFeeRoundingReserveTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/cross-border-fee-rounding-reserve",
    title: "Cross Border Fee Rounding Reserve Tool",
    description:
      "Expose an unrounded-minus-booked fee residual in supplied minor units; no exchange rate or fee schedule is chosen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amountMinor: { type: "integer", minimum: 0 },
        feeRate: { type: "number", minimum: 0 },
        fixedMinor: { type: "integer", minimum: 0 },
        bookedFeeMinor: { type: "integer", minimum: 0 },
      },
      required: ["amountMinor", "feeRate", "fixedMinor", "bookedFeeMinor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unroundedFee: { type: "number" },
        reserve: { type: "number" },
        netBookedMinor: { type: "integer" },
      },
      required: ["unroundedFee", "reserve", "netBookedMinor"],
    },
    ports: {
      inputs: [
        {
          id: "amountMinor",
          label: "Amount Minor",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "feeRate",
          label: "Fee Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedMinor",
          label: "Fixed Minor",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bookedFeeMinor",
          label: "Booked Fee Minor",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unroundedFee",
          label: "Unrounded Fee",
          valueType: { type: "number" },
        },
        { id: "reserve", label: "Reserve", valueType: { type: "number" } },
        {
          id: "netBookedMinor",
          label: "Net Booked Minor",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = crossBorderFeeRoundingReserveTool.execute;
export default crossBorderFeeRoundingReserveTool;

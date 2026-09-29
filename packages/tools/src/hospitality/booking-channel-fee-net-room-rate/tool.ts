import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossRate: number;
  readonly commissionRate: number;
  readonly fixedFee: number;
  readonly taxPassThrough: number;
};
export type Output = { readonly commission: number; readonly netRate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossRate: { type: "number" },
    commissionRate: { type: "number", minimum: 0, maximum: 1 },
    fixedFee: { type: "number", minimum: 0 },
    taxPassThrough: { type: "number", minimum: 0 },
  },
  required: ["grossRate", "commissionRate", "fixedFee", "taxPassThrough"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { commission: { type: "number" }, netRate: { type: "number" } },
  required: ["commission", "netRate"],
} as const;
/** Deduct commission on the rate excluding the supplied tax pass-through, then a fixed fee. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossRate, commissionRate, fixedFee, taxPassThrough } = request;
  const compute = (): Output => {
    H.domain(
      taxPassThrough >= 0 && grossRate >= taxPassThrough && fixedFee >= 0,
    );
    H.probability(commissionRate);
    return {
      commission: (grossRate - taxPassThrough) * commissionRate,
      netRate:
        grossRate -
        taxPassThrough -
        (grossRate - taxPassThrough) * commissionRate -
        fixedFee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossRate: 120,
    commissionRate: 0.15,
    fixedFee: 2,
    taxPassThrough: 20,
  },
  output: { commission: 15, netRate: 83 },
} satisfies ToolExample<Input, Output>;
export const bookingChannelFeeNetRoomRateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/booking-channel-fee-net-room-rate",
    title: "Booking Channel Fee Net Room Rate Tool",
    description:
      "Deduct commission on the rate excluding the supplied tax pass-through, then a fixed fee.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossRate: { type: "number" },
        commissionRate: { type: "number", minimum: 0, maximum: 1 },
        fixedFee: { type: "number", minimum: 0 },
        taxPassThrough: { type: "number", minimum: 0 },
      },
      required: ["grossRate", "commissionRate", "fixedFee", "taxPassThrough"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commission: { type: "number" },
        netRate: { type: "number" },
      },
      required: ["commission", "netRate"],
    },
    ports: {
      inputs: [
        {
          id: "grossRate",
          label: "Gross Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "commissionRate",
          label: "Commission Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedFee",
          label: "Fixed Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxPassThrough",
          label: "Tax Pass Through",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "commission",
          label: "Commission",
          valueType: { type: "number" },
        },
        { id: "netRate", label: "Net Rate", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bookingChannelFeeNetRoomRateTool.execute;
export default bookingChannelFeeNetRoomRateTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly saleValue: number;
  readonly rate: number;
  readonly minimumFee: number;
  readonly fixedFee: number;
};
export type Output = {
  readonly variableFee: number;
  readonly totalFee: number;
  readonly netProceeds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    saleValue: { type: "number", minimum: 0 },
    rate: { type: "number", minimum: 0 },
    minimumFee: { type: "number", minimum: 0 },
    fixedFee: { type: "number", minimum: 0 },
  },
  required: ["saleValue", "rate", "minimumFee", "fixedFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variableFee: { type: "number" },
    totalFee: { type: "number" },
    netProceeds: { type: "number" },
  },
  required: ["variableFee", "totalFee", "netProceeds"],
} as const;
/** Calculate farm auction vendor fee floor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { saleValue, rate, minimumFee, fixedFee } = request;
  const compute = (): Output => {
    H.domain(saleValue >= 0 && rate >= 0 && minimumFee >= 0 && fixedFee >= 0);
    return {
      variableFee: Math.max(minimumFee, saleValue * rate),
      totalFee: Math.max(minimumFee, saleValue * rate) + fixedFee,
      netProceeds:
        saleValue - Math.max(minimumFee, saleValue * rate) - fixedFee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { saleValue: 1000, rate: 0.02, minimumFee: 30, fixedFee: 5 },
  output: { variableFee: 30, totalFee: 35, netProceeds: 965 },
} satisfies ToolExample<Input, Output>;
export const farmAuctionVendorFeeFloorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/farm-auction-vendor-fee-floor",
    title: "Farm Auction Vendor Fee Floor Tool",
    description:
      "Calculate farm auction vendor fee floor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        saleValue: { type: "number", minimum: 0 },
        rate: { type: "number", minimum: 0 },
        minimumFee: { type: "number", minimum: 0 },
        fixedFee: { type: "number", minimum: 0 },
      },
      required: ["saleValue", "rate", "minimumFee", "fixedFee"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        variableFee: { type: "number" },
        totalFee: { type: "number" },
        netProceeds: { type: "number" },
      },
      required: ["variableFee", "totalFee", "netProceeds"],
    },
    ports: {
      inputs: [
        {
          id: "saleValue",
          label: "Sale Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rate",
          label: "Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumFee",
          label: "Minimum Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedFee",
          label: "Fixed Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "variableFee",
          label: "Variable Fee",
          valueType: { type: "number" },
        },
        { id: "totalFee", label: "Total Fee", valueType: { type: "number" } },
        {
          id: "netProceeds",
          label: "Net Proceeds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmAuctionVendorFeeFloorTool.execute;
export default farmAuctionVendorFeeFloorTool;

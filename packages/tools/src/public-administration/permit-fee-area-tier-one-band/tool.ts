import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly lowerArea: number;
  readonly upperArea: number;
  readonly ratePerArea: number;
};
export type Output = { readonly chargeableArea: number; readonly fee: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    lowerArea: { type: "number", minimum: 0 },
    upperArea: { type: "number" },
    ratePerArea: { type: "number", minimum: 0 },
  },
  required: ["area", "lowerArea", "upperArea", "ratePerArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { chargeableArea: { type: "number" }, fee: { type: "number" } },
  required: ["chargeableArea", "fee"],
} as const;
/** One marginal fee band with explicit boundaries and rate; no permit schedule is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, lowerArea, upperArea, ratePerArea } = request;
  const compute = (): Output => {
    H.domain(
      area >= 0 && lowerArea >= 0 && upperArea >= lowerArea && ratePerArea >= 0,
    );
    return {
      chargeableArea: Math.max(0, Math.min(area, upperArea) - lowerArea),
      fee: Math.max(0, Math.min(area, upperArea) - lowerArea) * ratePerArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { area: 150, lowerArea: 100, upperArea: 200, ratePerArea: 2 },
  output: { chargeableArea: 50, fee: 100 },
} satisfies ToolExample<Input, Output>;
export const permitFeeAreaTierOneBandTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/permit-fee-area-tier-one-band",
    title: "Permit Fee Area Tier One Band Tool",
    description:
      "One marginal fee band with explicit boundaries and rate; no permit schedule is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        lowerArea: { type: "number", minimum: 0 },
        upperArea: { type: "number" },
        ratePerArea: { type: "number", minimum: 0 },
      },
      required: ["area", "lowerArea", "upperArea", "ratePerArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chargeableArea: { type: "number" },
        fee: { type: "number" },
      },
      required: ["chargeableArea", "fee"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerArea",
          label: "Lower Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperArea",
          label: "Upper Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ratePerArea",
          label: "Rate Per Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "chargeableArea",
          label: "Chargeable Area",
          valueType: { type: "number" },
        },
        { id: "fee", label: "Fee", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = permitFeeAreaTierOneBandTool.execute;
export default permitFeeAreaTierOneBandTool;

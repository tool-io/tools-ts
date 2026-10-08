import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPeakKilowatts: number;
  readonly billedDemandFloorKilowatts: number;
  readonly ratePerKilowatt: number;
};
export type Output = {
  readonly billedKilowatts: number;
  readonly demandCharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPeakKilowatts: { type: "number", minimum: 0 },
    billedDemandFloorKilowatts: { type: "number", minimum: 0 },
    ratePerKilowatt: { type: "number", minimum: 0 },
  },
  required: [
    "measuredPeakKilowatts",
    "billedDemandFloorKilowatts",
    "ratePerKilowatt",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    billedKilowatts: { type: "number" },
    demandCharge: { type: "number" },
  },
  required: ["billedKilowatts", "demandCharge"],
} as const;
/** Extend an explicit demand charge using a caller-supplied peak and minimum billed-demand floor, excluding ratchet history and other tariff rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredPeakKilowatts, billedDemandFloorKilowatts, ratePerKilowatt } =
    request;
  const compute = (): Output => {
    H.domain(
      measuredPeakKilowatts >= 0 &&
        billedDemandFloorKilowatts >= 0 &&
        ratePerKilowatt >= 0,
      "measuredPeakKilowatts",
    );
    return {
      billedKilowatts: Math.max(
        measuredPeakKilowatts,
        billedDemandFloorKilowatts,
      ),
      demandCharge:
        Math.max(measuredPeakKilowatts, billedDemandFloorKilowatts) *
        ratePerKilowatt,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredPeakKilowatts: 80,
    billedDemandFloorKilowatts: 100,
    ratePerKilowatt: 5,
  },
  output: { billedKilowatts: 100, demandCharge: 500 },
} satisfies ToolExample<Input, Output>;
export const demandChargePeakIntervalCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["energy-economics", "energy economics", "economics"],
      keywords: ["energy economics", "economics"],
    },
    id: "energy-economics/demand-charge-peak-interval-cost",
    title: "Demand Charge Peak Interval Cost",
    description:
      "Extend an explicit demand charge using a caller-supplied peak and minimum billed-demand floor, excluding ratchet history and other tariff rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPeakKilowatts: { type: "number", minimum: 0 },
        billedDemandFloorKilowatts: { type: "number", minimum: 0 },
        ratePerKilowatt: { type: "number", minimum: 0 },
      },
      required: [
        "measuredPeakKilowatts",
        "billedDemandFloorKilowatts",
        "ratePerKilowatt",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        billedKilowatts: { type: "number" },
        demandCharge: { type: "number" },
      },
      required: ["billedKilowatts", "demandCharge"],
    },
    ports: {
      inputs: [
        {
          id: "measuredPeakKilowatts",
          label: "Measured Peak Kilowatts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "billedDemandFloorKilowatts",
          label: "Billed Demand Floor Kilowatts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ratePerKilowatt",
          label: "Rate Per Kilowatt",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "billedKilowatts",
          label: "Billed Kilowatts",
          valueType: { type: "number" },
        },
        {
          id: "demandCharge",
          label: "Demand Charge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = demandChargePeakIntervalCostTool.execute;
export default demandChargePeakIntervalCostTool;

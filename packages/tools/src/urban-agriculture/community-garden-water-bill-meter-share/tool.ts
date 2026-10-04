import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plotMeter: number;
  readonly allMeters: readonly number[];
  readonly bill: number;
  readonly fixedCharge: number;
  readonly equalShares: number;
};
export type Output = { readonly allocation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plotMeter: { type: "number", minimum: 0 },
    allMeters: { type: "array", maxItems: 256, items: { type: "number" } },
    bill: { type: "number", minimum: 0 },
    fixedCharge: { type: "number", minimum: 0 },
    equalShares: { type: "integer", minimum: 1 },
  },
  required: ["plotMeter", "allMeters", "bill", "fixedCharge", "equalShares"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { allocation: { type: "number" } },
  required: ["allocation"],
} as const;
/** Calculate community garden water bill meter share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plotMeter, allMeters, bill, fixedCharge, equalShares } = request;
  const compute = (): Output => {
    H.domain(
      plotMeter >= 0 &&
        allMeters.every((x) => x >= 0) &&
        allMeters.reduce((a, b) => a + b, 0) > 0 &&
        plotMeter <= allMeters.reduce((a, b) => a + b, 0) &&
        bill >= 0 &&
        fixedCharge >= 0,
    );
    H.integer(equalShares, 1);
    return {
      allocation:
        (bill * plotMeter) / allMeters.reduce((a, b) => a + b, 0) +
        fixedCharge / equalShares,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    plotMeter: 20,
    allMeters: [20, 30, 50],
    bill: 100,
    fixedCharge: 20,
    equalShares: 4,
  },
  output: { allocation: 25 },
} satisfies ToolExample<Input, Output>;
export const communityGardenWaterBillMeterShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/community-garden-water-bill-meter-share",
    title: "Community Garden Water Bill Meter Share Tool",
    description:
      "Calculate community garden water bill meter share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plotMeter: { type: "number", minimum: 0 },
        allMeters: { type: "array", maxItems: 256, items: { type: "number" } },
        bill: { type: "number", minimum: 0 },
        fixedCharge: { type: "number", minimum: 0 },
        equalShares: { type: "integer", minimum: 1 },
      },
      required: [
        "plotMeter",
        "allMeters",
        "bill",
        "fixedCharge",
        "equalShares",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { allocation: { type: "number" } },
      required: ["allocation"],
    },
    ports: {
      inputs: [
        {
          id: "plotMeter",
          label: "Plot Meter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allMeters",
          label: "All Meters",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "bill",
          label: "Bill",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedCharge",
          label: "Fixed Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalShares",
          label: "Equal Shares",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "allocation",
          label: "Allocation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = communityGardenWaterBillMeterShareTool.execute;
export default communityGardenWaterBillMeterShareTool;

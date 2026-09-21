import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workHours: number;
  readonly hourlyRate: number;
  readonly minimumCharge: number;
  readonly travelCharge: number;
};
export type Output = {
  readonly workCharge: number;
  readonly minimumSupplement: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workHours: { type: "number", minimum: 0 },
    hourlyRate: { type: "number", minimum: 0 },
    minimumCharge: { type: "number", minimum: 0 },
    travelCharge: { type: "number", minimum: 0 },
  },
  required: ["workHours", "hourlyRate", "minimumCharge", "travelCharge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workCharge: { type: "number" },
    minimumSupplement: { type: "number" },
    total: { type: "number" },
  },
  required: ["workCharge", "minimumSupplement", "total"],
} as const;
/** Calculate harvest contractor minimum callout gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workHours, hourlyRate, minimumCharge, travelCharge } = request;
  const compute = (): Output => {
    H.domain(
      workHours >= 0 &&
        hourlyRate >= 0 &&
        minimumCharge >= 0 &&
        travelCharge >= 0,
    );
    return {
      workCharge: workHours * hourlyRate,
      minimumSupplement: Math.max(0, minimumCharge - workHours * hourlyRate),
      total: Math.max(minimumCharge, workHours * hourlyRate) + travelCharge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workHours: 2, hourlyRate: 50, minimumCharge: 150, travelCharge: 20 },
  output: { workCharge: 100, minimumSupplement: 50, total: 170 },
} satisfies ToolExample<Input, Output>;
export const harvestContractorMinimumCalloutGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/harvest-contractor-minimum-callout-gap",
    title: "Harvest Contractor Minimum Callout Gap Tool",
    description:
      "Calculate harvest contractor minimum callout gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workHours: { type: "number", minimum: 0 },
        hourlyRate: { type: "number", minimum: 0 },
        minimumCharge: { type: "number", minimum: 0 },
        travelCharge: { type: "number", minimum: 0 },
      },
      required: ["workHours", "hourlyRate", "minimumCharge", "travelCharge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workCharge: { type: "number" },
        minimumSupplement: { type: "number" },
        total: { type: "number" },
      },
      required: ["workCharge", "minimumSupplement", "total"],
    },
    ports: {
      inputs: [
        {
          id: "workHours",
          label: "Work Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hourlyRate",
          label: "Hourly Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumCharge",
          label: "Minimum Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "travelCharge",
          label: "Travel Charge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "workCharge",
          label: "Work Charge",
          valueType: { type: "number" },
        },
        {
          id: "minimumSupplement",
          label: "Minimum Supplement",
          valueType: { type: "number" },
        },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = harvestContractorMinimumCalloutGapTool.execute;
export default harvestContractorMinimumCalloutGapTool;

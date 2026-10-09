import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowCubicMetersPerDay: number;
  readonly bedAreaSquareMeters: number;
};
export type Output = {
  readonly loadingMetersPerDay: number;
  readonly loadingMillimetersPerDay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowCubicMetersPerDay: { type: "number", minimum: 0 },
    bedAreaSquareMeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["flowCubicMetersPerDay", "bedAreaSquareMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loadingMetersPerDay: { type: "number" },
    loadingMillimetersPerDay: { type: "number" },
  },
  required: ["loadingMetersPerDay", "loadingMillimetersPerDay"],
} as const;
/** Divide supplied daily flow by positive treatment-bed area and express hydraulic loading in meters and millimeters per day. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowCubicMetersPerDay, bedAreaSquareMeters } = request;
  const compute = (): Output => {
    H.domain(flowCubicMetersPerDay >= 0, "flowCubicMetersPerDay");
    (H.domain(
      Number.isFinite(bedAreaSquareMeters) && bedAreaSquareMeters > 0,
      "bedAreaSquareMeters",
    ),
      bedAreaSquareMeters);
    return {
      loadingMetersPerDay: flowCubicMetersPerDay / bedAreaSquareMeters,
      loadingMillimetersPerDay:
        (flowCubicMetersPerDay / bedAreaSquareMeters) * 1000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flowCubicMetersPerDay: 20, bedAreaSquareMeters: 100 },
  output: { loadingMetersPerDay: 0.2, loadingMillimetersPerDay: 200 },
} satisfies ToolExample<Input, Output>;
export const treatmentBedHydraulicLoadingUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/treatment-bed-hydraulic-loading-unit",
    title: "Treatment BED Hydraulic Loading Unit Tool",
    description:
      "Divide supplied daily flow by positive treatment-bed area and express hydraulic loading in meters and millimeters per day.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowCubicMetersPerDay: { type: "number", minimum: 0 },
        bedAreaSquareMeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["flowCubicMetersPerDay", "bedAreaSquareMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loadingMetersPerDay: { type: "number" },
        loadingMillimetersPerDay: { type: "number" },
      },
      required: ["loadingMetersPerDay", "loadingMillimetersPerDay"],
    },
    ports: {
      inputs: [
        {
          id: "flowCubicMetersPerDay",
          label: "Flow Cubic Meters Per Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bedAreaSquareMeters",
          label: "Bed Area Square Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "loadingMetersPerDay",
          label: "Loading Meters Per Day",
          valueType: { type: "number" },
        },
        {
          id: "loadingMillimetersPerDay",
          label: "Loading Millimeters Per Day",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treatmentBedHydraulicLoadingUnitTool.execute;
export default treatmentBedHydraulicLoadingUnitTool;

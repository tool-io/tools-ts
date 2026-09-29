import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedTime: number;
  readonly anchorTime: number;
  readonly offsetAtAnchor: number;
  readonly driftPerTime: number;
};
export type Output = {
  readonly correction: number;
  readonly correctedTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedTime: { type: "number" },
    anchorTime: { type: "number" },
    offsetAtAnchor: { type: "number" },
    driftPerTime: { type: "number" },
  },
  required: ["recordedTime", "anchorTime", "offsetAtAnchor", "driftPerTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correction: { type: "number" },
    correctedTime: { type: "number" },
  },
  required: ["correction", "correctedTime"],
} as const;
/** Subtract a supplied clock-fast offset plus linear drift evaluated on the recorded-time axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedTime, anchorTime, offsetAtAnchor, driftPerTime } = request;
  const compute = (): Output => {
    return {
      correction: offsetAtAnchor + driftPerTime * (recordedTime - anchorTime),
      correctedTime:
        recordedTime -
        offsetAtAnchor -
        driftPerTime * (recordedTime - anchorTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedTime: 1100,
    anchorTime: 1000,
    offsetAtAnchor: 2,
    driftPerTime: 0.01,
  },
  output: { correction: 3, correctedTime: 1097 },
} satisfies ToolExample<Input, Output>;
export const rainfallGaugeClockDriftAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/rainfall-gauge-clock-drift-adjustment",
    title: "Rainfall Gauge Clock Drift Adjustment Tool",
    description:
      "Subtract a supplied clock-fast offset plus linear drift evaluated on the recorded-time axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedTime: { type: "number" },
        anchorTime: { type: "number" },
        offsetAtAnchor: { type: "number" },
        driftPerTime: { type: "number" },
      },
      required: [
        "recordedTime",
        "anchorTime",
        "offsetAtAnchor",
        "driftPerTime",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correction: { type: "number" },
        correctedTime: { type: "number" },
      },
      required: ["correction", "correctedTime"],
    },
    ports: {
      inputs: [
        {
          id: "recordedTime",
          label: "Recorded Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "anchorTime",
          label: "Anchor Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offsetAtAnchor",
          label: "Offset At Anchor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "driftPerTime",
          label: "Drift Per Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correction",
          label: "Correction",
          valueType: { type: "number" },
        },
        {
          id: "correctedTime",
          label: "Corrected Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rainfallGaugeClockDriftAdjustmentTool.execute;
export default rainfallGaugeClockDriftAdjustmentTool;

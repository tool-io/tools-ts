import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrackingDriftPerHourInput = Readonly<{
  readonly driftMillimeters: number;
  readonly observationMinutes: number;
}>;
export type TrackingDriftPerHourOutput = Readonly<{
  readonly millimetersPerHour: number;
}>;

export const calculateTrackingDriftPerHour = (
  x: TrackingDriftPerHourInput,
): TrackingDriftPerHourOutput => {
  if (!Number.isFinite(x.driftMillimeters) || x.driftMillimeters < 0)
    simpleError("driftMillimeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.observationMinutes) || x.observationMinutes <= 0)
    simpleError("observationMinutes", "Provide a finite positive number.");
  const millimetersPerHour = (60 * x.driftMillimeters) / x.observationMinutes;
  if (!Number.isFinite(millimetersPerHour))
    simpleError(
      "millimetersPerHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    millimetersPerHour: Object.is(millimetersPerHour, -0)
      ? 0
      : millimetersPerHour,
  };
};

export const example = {
  input: {
    driftMillimeters: 2,
    observationMinutes: 30,
  },
  output: { millimetersPerHour: 4 },
} satisfies ToolExample<TrackingDriftPerHourInput, TrackingDriftPerHourOutput>;

export const tool = createSimpleTool({
  id: "vr/tracking-drift-per-hour",
  title: "Tracking Drift Per Hour",
  description:
    "Linear extrapolation of measured position drift to millimetres per hour.",
  inputs: [
    {
      id: "driftMillimeters",
      kind: "number",
      label: "Drift Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "observationMinutes",
      kind: "number",
      label: "Observation Minutes",
      unit: "min",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "millimetersPerHour",
      kind: "number",
      label: "Millimeters Per Hour",
      unit: "mm/h",
    },
  ],
  calculate: (input) =>
    calculateTrackingDriftPerHour({
      driftMillimeters: input.driftMillimeters as number,
      observationMinutes: input.observationMinutes as number,
    }),
});
export const trackingDriftPerHourTool = tool;
export const runTrackingDriftPerHour = tool.execute;
export default tool;

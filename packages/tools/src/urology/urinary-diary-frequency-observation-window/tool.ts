import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly events: number;
  readonly observedHours: number;
  readonly excludedHours: number;
  readonly reportHours: number;
};
export type Output = {
  readonly effectiveHours: number;
  readonly ratePerHour: number;
  readonly standardizedEvents: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    events: { type: "integer", minimum: 0 },
    observedHours: { type: "number" },
    excludedHours: { type: "number", minimum: 0 },
    reportHours: { type: "number", minimum: 0 },
  },
  required: ["events", "observedHours", "excludedHours", "reportHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveHours: { type: "number" },
    ratePerHour: { type: "number" },
    standardizedEvents: { type: "number" },
  },
  required: ["effectiveHours", "ratePerHour", "standardizedEvents"],
} as const;
/** Observed diary event rate and explicitly normalized exposure, without symptom or clinical frequency interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { events, observedHours, excludedHours, reportHours } = request;
  const compute = (): Output => {
    H.integer(events, 0);
    H.domain(
      excludedHours >= 0 && observedHours > excludedHours && reportHours >= 0,
    );
    return {
      effectiveHours: observedHours - excludedHours,
      ratePerHour: events / (observedHours - excludedHours),
      standardizedEvents:
        (events * reportHours) / (observedHours - excludedHours),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { events: 6, observedHours: 24, excludedHours: 4, reportHours: 24 },
  output: { effectiveHours: 20, ratePerHour: 0.3, standardizedEvents: 7.2 },
} satisfies ToolExample<Input, Output>;
export const urinaryDiaryFrequencyObservationWindowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "urology/urinary-diary-frequency-observation-window",
      title: "Urinary Diary Frequency Observation Window Tool",
      description:
        "Observed diary event rate and explicitly normalized exposure, without symptom or clinical frequency interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          events: { type: "integer", minimum: 0 },
          observedHours: { type: "number" },
          excludedHours: { type: "number", minimum: 0 },
          reportHours: { type: "number", minimum: 0 },
        },
        required: ["events", "observedHours", "excludedHours", "reportHours"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          effectiveHours: { type: "number" },
          ratePerHour: { type: "number" },
          standardizedEvents: { type: "number" },
        },
        required: ["effectiveHours", "ratePerHour", "standardizedEvents"],
      },
      ports: {
        inputs: [
          {
            id: "events",
            label: "Events",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "observedHours",
            label: "Observed Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "excludedHours",
            label: "Excluded Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reportHours",
            label: "Report Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "effectiveHours",
            label: "Effective Hours",
            valueType: { type: "number" },
          },
          {
            id: "ratePerHour",
            label: "Rate Per Hour",
            valueType: { type: "number" },
          },
          {
            id: "standardizedEvents",
            label: "Standardized Events",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = urinaryDiaryFrequencyObservationWindowTool.execute;
export default urinaryDiaryFrequencyObservationWindowTool;

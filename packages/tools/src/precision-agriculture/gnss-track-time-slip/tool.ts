import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedAt: number;
  readonly referenceAt: number;
  readonly speed: number;
};
export type Output = {
  readonly timeSlip: number;
  readonly alongTrackSlip: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedAt: { type: "number" },
    referenceAt: { type: "number" },
    speed: { type: "number", minimum: 0 },
  },
  required: ["recordedAt", "referenceAt", "speed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timeSlip: { type: "number" },
    alongTrackSlip: { type: "number" },
  },
  required: ["timeSlip", "alongTrackSlip"],
} as const;
/** Convert a supplied GNSS record clock difference to constant-speed along-track displacement without device access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedAt, referenceAt, speed } = request;
  const compute = (): Output => {
    H.domain(speed >= 0);
    return {
      timeSlip: recordedAt - referenceAt,
      alongTrackSlip: (recordedAt - referenceAt) * speed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedAt: 12, referenceAt: 10, speed: 3 },
  output: { timeSlip: 2, alongTrackSlip: 6 },
} satisfies ToolExample<Input, Output>;
export const gnssTrackTimeSlipTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "precision-agriculture/gnss-track-time-slip",
    title: "GNSS Track Time SLIP Tool",
    description:
      "Convert a supplied GNSS record clock difference to constant-speed along-track displacement without device access.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedAt: { type: "number" },
        referenceAt: { type: "number" },
        speed: { type: "number", minimum: 0 },
      },
      required: ["recordedAt", "referenceAt", "speed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timeSlip: { type: "number" },
        alongTrackSlip: { type: "number" },
      },
      required: ["timeSlip", "alongTrackSlip"],
    },
    ports: {
      inputs: [
        {
          id: "recordedAt",
          label: "Recorded At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceAt",
          label: "Reference At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "speed",
          label: "Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "timeSlip", label: "Time Slip", valueType: { type: "number" } },
        {
          id: "alongTrackSlip",
          label: "Along Track Slip",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gnssTrackTimeSlipTool.execute;
export default gnssTrackTimeSlipTool;

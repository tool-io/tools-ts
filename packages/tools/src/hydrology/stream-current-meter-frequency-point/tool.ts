import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly revolutions: number;
  readonly durationSeconds: number;
  readonly slope: number;
  readonly intercept: number;
};
export type Output = {
  readonly frequencyHz: number;
  readonly velocity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    revolutions: { type: "integer", minimum: 0 },
    durationSeconds: { type: "number", exclusiveMinimum: 0 },
    slope: { type: "number" },
    intercept: { type: "number" },
  },
  required: ["revolutions", "durationSeconds", "slope", "intercept"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { frequencyHz: { type: "number" }, velocity: { type: "number" } },
  required: ["frequencyHz", "velocity"],
} as const;
/** Evaluate one supplied linear current-meter calibration segment v=a*f+b; no instrument calibration range is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { revolutions, durationSeconds, slope, intercept } = request;
  const compute = (): Output => {
    H.integer(revolutions, 0);
    H.positive(durationSeconds);
    const frequencyHz = revolutions / durationSeconds;
    return { frequencyHz, velocity: slope * frequencyHz + intercept };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { revolutions: 30, durationSeconds: 10, slope: 0.2, intercept: 0.05 },
  output: { frequencyHz: 3, velocity: 0.6500000000000001 },
} satisfies ToolExample<Input, Output>;
export const streamCurrentMeterFrequencyPointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/stream-current-meter-frequency-point",
    title: "Stream Current Meter Frequency Point Tool",
    description:
      "Evaluate one supplied linear current-meter calibration segment v=a*f+b; no instrument calibration range is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        revolutions: { type: "integer", minimum: 0 },
        durationSeconds: { type: "number", exclusiveMinimum: 0 },
        slope: { type: "number" },
        intercept: { type: "number" },
      },
      required: ["revolutions", "durationSeconds", "slope", "intercept"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frequencyHz: { type: "number" },
        velocity: { type: "number" },
      },
      required: ["frequencyHz", "velocity"],
    },
    ports: {
      inputs: [
        {
          id: "revolutions",
          label: "Revolutions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intercept",
          label: "Intercept",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "frequencyHz",
          label: "Frequency Hz",
          valueType: { type: "number", unit: "Hz" },
        },
        { id: "velocity", label: "Velocity", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = streamCurrentMeterFrequencyPointTool.execute;
export default streamCurrentMeterFrequencyPointTool;

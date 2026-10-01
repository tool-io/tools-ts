import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedTime: number;
  readonly elapsedSeconds: number;
  readonly driftPpm: number;
  readonly zeroOffsetSeconds: number;
};
export type Output = {
  readonly driftSeconds: number;
  readonly correctedTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedTime: { type: "number" },
    elapsedSeconds: { type: "number", minimum: 0 },
    driftPpm: { type: "number" },
    zeroOffsetSeconds: { type: "number" },
  },
  required: ["recordedTime", "elapsedSeconds", "driftPpm", "zeroOffsetSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    driftSeconds: { type: "number" },
    correctedTime: { type: "number" },
  },
  required: ["driftSeconds", "correctedTime"],
} as const;
/** Subtract explicitly supplied linear clock drift and zero offset from a research timestamp. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedTime, elapsedSeconds, driftPpm, zeroOffsetSeconds } = request;
  const compute = (): Output => {
    H.domain(elapsedSeconds >= 0);
    const driftSeconds = (elapsedSeconds * driftPpm) / 1e6;
    return {
      driftSeconds,
      correctedTime: recordedTime - zeroOffsetSeconds - driftSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedTime: 1000,
    elapsedSeconds: 10000,
    driftPpm: 20,
    zeroOffsetSeconds: 0.1,
  },
  output: { driftSeconds: 0.2, correctedTime: 999.6999999999999 },
} satisfies ToolExample<Input, Output>;
export const obstetricMonitorClockDriftFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "obstetrics/obstetric-monitor-clock-drift-factor",
    title: "Obstetric Monitor Clock Drift Factor Tool",
    description:
      "Subtract explicitly supplied linear clock drift and zero offset from a research timestamp.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedTime: { type: "number" },
        elapsedSeconds: { type: "number", minimum: 0 },
        driftPpm: { type: "number" },
        zeroOffsetSeconds: { type: "number" },
      },
      required: [
        "recordedTime",
        "elapsedSeconds",
        "driftPpm",
        "zeroOffsetSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        driftSeconds: { type: "number" },
        correctedTime: { type: "number" },
      },
      required: ["driftSeconds", "correctedTime"],
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
          id: "elapsedSeconds",
          label: "Elapsed Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "driftPpm",
          label: "Drift Ppm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroOffsetSeconds",
          label: "Zero Offset Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "driftSeconds",
          label: "Drift Seconds",
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
export const run = obstetricMonitorClockDriftFactorTool.execute;
export default obstetricMonitorClockDriftFactorTool;

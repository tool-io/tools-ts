import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly waveNumberRadiansPerMeter: number;
  readonly angularFrequencyRadiansPerSecond: number;
  readonly positionMeters: number;
  readonly timeSeconds: number;
  readonly suppliedPhaseRadians: number;
};
export type Output = { readonly phaseRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waveNumberRadiansPerMeter: { type: "number" },
    angularFrequencyRadiansPerSecond: { type: "number" },
    positionMeters: { type: "number" },
    timeSeconds: { type: "number" },
    suppliedPhaseRadians: { type: "number" },
  },
  required: [
    "waveNumberRadiansPerMeter",
    "angularFrequencyRadiansPerSecond",
    "positionMeters",
    "timeSeconds",
    "suppliedPhaseRadians",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phaseRadians: { type: "number" } },
  required: ["phaseRadians"],
} as const;
/** Evaluate an explicit traveling-wave phase under the supplied k*x-omega*t+phase convention without wrapping. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    waveNumberRadiansPerMeter,
    angularFrequencyRadiansPerSecond,
    positionMeters,
    timeSeconds,
    suppliedPhaseRadians,
  } = request;
  const compute = (): Output => {
    return {
      phaseRadians:
        waveNumberRadiansPerMeter * positionMeters -
        angularFrequencyRadiansPerSecond * timeSeconds +
        suppliedPhaseRadians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    waveNumberRadiansPerMeter: 2,
    angularFrequencyRadiansPerSecond: 3,
    positionMeters: 4,
    timeSeconds: 1,
    suppliedPhaseRadians: 0.5,
  },
  output: { phaseRadians: 5.5 },
} satisfies ToolExample<Input, Output>;
export const wavePhaseAtSuppliedOriginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["physics"],
      keywords: ["physics"],
    },
    id: "physics/wave-phase-at-supplied-origin",
    title: "Wave Phase At Supplied Origin",
    description:
      "Evaluate an explicit traveling-wave phase under the supplied k*x-omega*t+phase convention without wrapping.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waveNumberRadiansPerMeter: { type: "number" },
        angularFrequencyRadiansPerSecond: { type: "number" },
        positionMeters: { type: "number" },
        timeSeconds: { type: "number" },
        suppliedPhaseRadians: { type: "number" },
      },
      required: [
        "waveNumberRadiansPerMeter",
        "angularFrequencyRadiansPerSecond",
        "positionMeters",
        "timeSeconds",
        "suppliedPhaseRadians",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phaseRadians: { type: "number" } },
      required: ["phaseRadians"],
    },
    ports: {
      inputs: [
        {
          id: "waveNumberRadiansPerMeter",
          label: "Wave Number Radians Per Meter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angularFrequencyRadiansPerSecond",
          label: "Angular Frequency Radians Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positionMeters",
          label: "Position Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeSeconds",
          label: "Time Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPhaseRadians",
          label: "Supplied Phase Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phaseRadians",
          label: "Phase Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wavePhaseAtSuppliedOriginTool.execute;
export default wavePhaseAtSuppliedOriginTool;

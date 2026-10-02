import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angularFrequency: number;
  readonly timeShift: number;
  readonly initialPhase: number;
};
export type Output = { readonly phase: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angularFrequency: { type: "number" },
    timeShift: { type: "number" },
    initialPhase: { type: "number" },
  },
  required: ["angularFrequency", "timeShift", "initialPhase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phase: { type: "number" } },
  required: ["phase"],
} as const;
/** Shift the phase of a cos(omega*t+phase) wave when the supplied time coordinate is advanced. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { angularFrequency, timeShift, initialPhase } = input;
  const compute = (): Output => {
    return {
      phase: H.mod(initialPhase - angularFrequency * timeShift, 2 * Math.PI),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { angularFrequency: 3.141592653589793, timeShift: 1, initialPhase: 0 },
  output: { phase: 3.141592653589793 },
} satisfies ToolExample<Input, Output>;
export const waveRelativePhaseTimeShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/wave-relative-phase-time-shift",
    title: "Wave Relative Phase Time Shift Tool",
    description:
      "Shift the phase of a cos(omega*t+phase) wave when the supplied time coordinate is advanced.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angularFrequency: { type: "number" },
        timeShift: { type: "number" },
        initialPhase: { type: "number" },
      },
      required: ["angularFrequency", "timeShift", "initialPhase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phase: { type: "number" } },
      required: ["phase"],
    },
    ports: {
      inputs: [
        {
          id: "angularFrequency",
          label: "Angular Frequency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeShift",
          label: "Time Shift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialPhase",
          label: "Initial Phase",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "phase", label: "Phase", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = waveRelativePhaseTimeShiftTool.execute;
export default waveRelativePhaseTimeShiftTool;

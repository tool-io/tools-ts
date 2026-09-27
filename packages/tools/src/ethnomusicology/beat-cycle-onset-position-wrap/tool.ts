import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onsetPulses: number;
  readonly cyclePulses: number;
  readonly originPulses: number;
};
export type Output = {
  readonly cycleIndex: number;
  readonly position: number;
  readonly phaseFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onsetPulses: { type: "number" },
    cyclePulses: { type: "number", exclusiveMinimum: 0 },
    originPulses: { type: "number" },
  },
  required: ["onsetPulses", "cyclePulses", "originPulses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleIndex: { type: "integer" },
    position: { type: "number" },
    phaseFraction: { type: "number" },
  },
  required: ["cycleIndex", "position", "phaseFraction"],
} as const;
/** Wrap an explicit onset into a caller-defined beat cycle; no culturally specific meter is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onsetPulses, cyclePulses, originPulses } = request;
  const compute = (): Output => {
    const modulo = (value: number, modulus: number): number => {
      const remainder = value % modulus;
      const positive = remainder < 0 ? remainder + modulus : remainder;
      return positive === modulus ? 0 : positive;
    };
    H.positive(cyclePulses);
    return {
      cycleIndex: Math.floor((onsetPulses - originPulses) / cyclePulses),
      position: modulo(onsetPulses - originPulses, cyclePulses),
      phaseFraction:
        modulo(onsetPulses - originPulses, cyclePulses) / cyclePulses,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { onsetPulses: 17, cyclePulses: 8, originPulses: 1 },
  output: { cycleIndex: 2, position: 0, phaseFraction: 0 },
} satisfies ToolExample<Input, Output>;
export const beatCycleOnsetPositionWrapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/beat-cycle-onset-position-wrap",
    title: "Beat Cycle Onset Position Wrap Tool",
    description:
      "Wrap an explicit onset into a caller-defined beat cycle; no culturally specific meter is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onsetPulses: { type: "number" },
        cyclePulses: { type: "number", exclusiveMinimum: 0 },
        originPulses: { type: "number" },
      },
      required: ["onsetPulses", "cyclePulses", "originPulses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleIndex: { type: "integer" },
        position: { type: "number" },
        phaseFraction: { type: "number" },
      },
      required: ["cycleIndex", "position", "phaseFraction"],
    },
    ports: {
      inputs: [
        {
          id: "onsetPulses",
          label: "Onset Pulses",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cyclePulses",
          label: "Cycle Pulses",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originPulses",
          label: "Origin Pulses",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cycleIndex",
          label: "Cycle Index",
          valueType: { type: "integer" },
        },
        { id: "position", label: "Position", valueType: { type: "number" } },
        {
          id: "phaseFraction",
          label: "Phase Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = beatCycleOnsetPositionWrapTool.execute;
export default beatCycleOnsetPositionWrapTool;

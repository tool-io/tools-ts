import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slot: number;
  readonly shift: number;
  readonly cycleLength: number;
};
export type Output = { readonly phase: number; readonly cycleCarry: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slot: { type: "integer" },
    shift: { type: "integer" },
    cycleLength: { type: "integer", minimum: 1 },
  },
  required: ["slot", "shift", "cycleLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phase: { type: "integer" }, cycleCarry: { type: "integer" } },
  required: ["phase", "cycleCarry"],
} as const;
/** Shift explicit slot indices in a supplied public rhythmic cycle without imposing a musical tradition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slot, shift, cycleLength } = request;
  const compute = (): Output => {
    H.integer(cycleLength, 1);
    const t = BigInt(slot) + BigInt(shift),
      p = BigInt(cycleLength),
      r = ((t % p) + p) % p;
    return { phase: Number(r), cycleCarry: Number((t - r) / p) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slot: 6, shift: 3, cycleLength: 8 },
  output: { phase: 1, cycleCarry: 1 },
} satisfies ToolExample<Input, Output>;
export const publicRhythmCyclePhaseShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/public-rhythm-cycle-phase-shift",
    title: "Public Rhythm Cycle Phase Shift Tool",
    description:
      "Shift explicit slot indices in a supplied public rhythmic cycle without imposing a musical tradition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slot: { type: "integer" },
        shift: { type: "integer" },
        cycleLength: { type: "integer", minimum: 1 },
      },
      required: ["slot", "shift", "cycleLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phase: { type: "integer" },
        cycleCarry: { type: "integer" },
      },
      required: ["phase", "cycleCarry"],
    },
    ports: {
      inputs: [
        {
          id: "slot",
          label: "Slot",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "shift",
          label: "Shift",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cycleLength",
          label: "Cycle Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "phase", label: "Phase", valueType: { type: "integer" } },
        {
          id: "cycleCarry",
          label: "Cycle Carry",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicRhythmCyclePhaseShiftTool.execute;
export default publicRhythmCyclePhaseShiftTool;

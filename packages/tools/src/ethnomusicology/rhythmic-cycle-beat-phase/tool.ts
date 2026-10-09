import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beatPosition: number;
  readonly beatsPerCycle: number;
};
export type Output = {
  readonly phaseBeats: number;
  readonly phaseFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beatPosition: { type: "number" },
    beatsPerCycle: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["beatPosition", "beatsPerCycle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseBeats: { type: "number" },
    phaseFraction: { type: "number" },
  },
  required: ["phaseBeats", "phaseFraction"],
} as const;
/** Wrap a supplied beat position into a caller-defined rhythmic cycle without identifying a musical meter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beatPosition, beatsPerCycle } = request;
  const compute = (): Output => {
    (H.domain(beatsPerCycle > 0, "beatsPerCycle"), beatsPerCycle);
    return (() => {
      const r = beatPosition % beatsPerCycle,
        wrapped = r < 0 ? r + beatsPerCycle : r,
        phaseBeats = wrapped === beatsPerCycle ? 0 : wrapped;
      return { phaseBeats, phaseFraction: phaseBeats / beatsPerCycle };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beatPosition: 11.5, beatsPerCycle: 8 },
  output: { phaseBeats: 3.5, phaseFraction: 0.4375 },
} satisfies ToolExample<Input, Output>;
export const rhythmicCycleBeatPhaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["ethnomusicology", "arts and design"],
      keywords: ["ethnomusicology", "arts and design"],
    },
    id: "ethnomusicology/rhythmic-cycle-beat-phase",
    title: "Rhythmic Cycle Beat Phase",
    description:
      "Wrap a supplied beat position into a caller-defined rhythmic cycle without identifying a musical meter.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beatPosition: { type: "number" },
        beatsPerCycle: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["beatPosition", "beatsPerCycle"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseBeats: { type: "number" },
        phaseFraction: { type: "number" },
      },
      required: ["phaseBeats", "phaseFraction"],
    },
    ports: {
      inputs: [
        {
          id: "beatPosition",
          label: "Beat Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beatsPerCycle",
          label: "Beats Per Cycle",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phaseBeats",
          label: "Phase Beats",
          valueType: { type: "number" },
        },
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
export const run = rhythmicCycleBeatPhaseTool.execute;
export default rhythmicCycleBeatPhaseTool;

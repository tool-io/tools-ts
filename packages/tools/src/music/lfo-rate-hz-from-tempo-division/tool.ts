import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LfoRateHzFromTempoDivisionInput = Readonly<{
  readonly beatsPerMinute: number;
  readonly quarterNotesPerCycle: number;
}>;
export type LfoRateHzFromTempoDivisionOutput = Readonly<{
  readonly lfoHertz: number;
}>;

export const calculateLfoRateHzFromTempoDivision = (
  x: LfoRateHzFromTempoDivisionInput,
): LfoRateHzFromTempoDivisionOutput => {
  if (!Number.isFinite(x.beatsPerMinute) || x.beatsPerMinute <= 0)
    simpleError("beatsPerMinute", "Provide a finite positive number.");
  if (!Number.isFinite(x.quarterNotesPerCycle) || x.quarterNotesPerCycle <= 0)
    simpleError("quarterNotesPerCycle", "Provide a finite positive number.");
  const lfoHertz = x.beatsPerMinute / (60 * x.quarterNotesPerCycle);
  if (!Number.isFinite(lfoHertz))
    simpleError(
      "lfoHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { lfoHertz: Object.is(lfoHertz, -0) ? 0 : lfoHertz };
};

export const example = {
  input: {
    beatsPerMinute: 120,
    quarterNotesPerCycle: 4,
  },
  output: { lfoHertz: 0.5 },
} satisfies ToolExample<
  LfoRateHzFromTempoDivisionInput,
  LfoRateHzFromTempoDivisionOutput
>;

export const tool = createSimpleTool({
  id: "music/lfo-rate-hz-from-tempo-division",
  title: "Lfo Rate Hz From Tempo Division",
  description:
    "LFO cycles per second when one cycle spans a chosen number of quarter notes at BPM.",
  inputs: [
    {
      id: "beatsPerMinute",
      kind: "number",
      label: "Beats Per Minute",
      unit: "bpm",
      minimum: 0,
    },
    {
      id: "quarterNotesPerCycle",
      kind: "number",
      label: "Quarter Notes Per Cycle",
      minimum: 0,
    },
  ],
  outputs: [{ id: "lfoHertz", kind: "number", label: "Lfo Hertz", unit: "Hz" }],
  calculate: (input) =>
    calculateLfoRateHzFromTempoDivision({
      beatsPerMinute: input.beatsPerMinute as number,
      quarterNotesPerCycle: input.quarterNotesPerCycle as number,
    }),
});
export const lfoRateHzFromTempoDivisionTool = tool;
export const runLfoRateHzFromTempoDivision = tool.execute;
export default tool;

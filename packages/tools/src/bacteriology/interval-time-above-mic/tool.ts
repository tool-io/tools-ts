import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly peakConcentration: number;
  readonly mic: number;
  readonly halfLifeHours: number;
  readonly dosingIntervalHours: number;
}>;
export type Output = Readonly<{
  readonly hoursAboveMic: number;
  readonly intervalAboveMicPercent: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.peakConcentration, "peakConcentration");
  positive(input.mic, "mic");
  positive(input.halfLifeHours, "halfLifeHours");
  positive(input.dosingIntervalHours, "dosingIntervalHours");
  const crossing =
      input.halfLifeHours * Math.log2(input.peakConcentration / input.mic),
    hoursAboveMic = Math.min(input.dosingIntervalHours, Math.max(0, crossing));
  return {
    hoursAboveMic,
    intervalAboveMicPercent: (100 * hoursAboveMic) / input.dosingIntervalHours,
  };
};
export const exampleInput = {
  peakConcentration: 8,
  mic: 2,
  halfLifeHours: 2,
  dosingIntervalHours: 6,
} satisfies Input;
export const exampleOutput = {
  hoursAboveMic: 4,
  intervalAboveMicPercent: 66.66666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/interval-time-above-mic",
  title: "Interval Time Above MIC",
  description:
    "Compute time above a supplied MIC in a monoexponential post-peak concentration interval; no regimen or clinical target is recommended.",
  inputs: [
    { id: "peakConcentration", label: "Peak concentration", kind: "number" },
    { id: "mic", label: "Mic", kind: "number" },
    { id: "halfLifeHours", label: "Half life hours", kind: "number" },
    {
      id: "dosingIntervalHours",
      label: "Dosing interval hours",
      kind: "number",
    },
  ],
  outputs: [
    { id: "hoursAboveMic", label: "Hours above mic", kind: "number" },
    {
      id: "intervalAboveMicPercent",
      label: "Interval above mic percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      peakConcentration: value.peakConcentration as number,
      mic: value.mic as number,
      halfLifeHours: value.halfLifeHours as number,
      dosingIntervalHours: value.dosingIntervalHours as number,
    }),
});
export const run = tool.execute;
export default tool;

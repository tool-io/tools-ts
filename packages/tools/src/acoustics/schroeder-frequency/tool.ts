import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SchroederFrequencyInput = Readonly<{
  readonly reverberationSeconds: number;
  readonly roomCubicMeters: number;
}>;
export type SchroederFrequencyOutput = Readonly<{
  readonly transitionHertz: number;
}>;

export const calculateSchroederFrequency = (
  x: SchroederFrequencyInput,
): SchroederFrequencyOutput => {
  if (!Number.isFinite(x.reverberationSeconds) || x.reverberationSeconds <= 0)
    simpleError("reverberationSeconds", "Provide a finite positive number.");
  if (!Number.isFinite(x.roomCubicMeters) || x.roomCubicMeters <= 0)
    simpleError("roomCubicMeters", "Provide a finite positive number.");
  const transitionHertz =
    2000 * Math.sqrt(x.reverberationSeconds / x.roomCubicMeters);
  if (!Number.isFinite(transitionHertz))
    simpleError(
      "transitionHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    transitionHertz: Object.is(transitionHertz, -0) ? 0 : transitionHertz,
  };
};

export const example = {
  input: {
    reverberationSeconds: 0.5,
    roomCubicMeters: 100,
  },
  output: { transitionHertz: 141.4213562373095 },
} satisfies ToolExample<SchroederFrequencyInput, SchroederFrequencyOutput>;

export const tool = createSimpleTool({
  id: "acoustics/schroeder-frequency",
  title: "Schroeder Frequency",
  description:
    "Approximate Schroeder transition frequency 2000 sqrt(RT60/V) for room volume in m³ and reverberation time in seconds.",
  inputs: [
    {
      id: "reverberationSeconds",
      kind: "number",
      label: "Reverberation Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "roomCubicMeters",
      kind: "number",
      label: "Room Cubic Meters",
      unit: "m3",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "transitionHertz",
      kind: "number",
      label: "Transition Hertz",
      unit: "Hz",
    },
  ],
  calculate: (input) =>
    calculateSchroederFrequency({
      reverberationSeconds: input.reverberationSeconds as number,
      roomCubicMeters: input.roomCubicMeters as number,
    }),
});
export const schroederFrequencyTool = tool;
export const runSchroederFrequency = tool.execute;
export default tool;

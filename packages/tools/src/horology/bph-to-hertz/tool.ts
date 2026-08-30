import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BphToHertzInput = Readonly<{
  readonly beatsPerHour: number;
}>;
export type BphToHertzOutput = Readonly<{
  readonly hertz: number;
}>;

export const calculateBphToHertz = (x: BphToHertzInput): BphToHertzOutput => {
  if (!Number.isFinite(x.beatsPerHour) || x.beatsPerHour <= 0)
    simpleError("beatsPerHour", "Provide a finite positive number.");
  const hertz = x.beatsPerHour / 7200;
  if (!Number.isFinite(hertz))
    simpleError("hertz", "Inputs produce an undefined or out-of-range result.");
  return { hertz: Object.is(hertz, -0) ? 0 : hertz };
};

export const example = {
  input: {
    beatsPerHour: 28800,
  },
  output: { hertz: 4 },
} satisfies ToolExample<BphToHertzInput, BphToHertzOutput>;

export const tool = createSimpleTool({
  id: "horology/bph-to-hertz",
  title: "Bph To Hertz",
  description:
    "Balance oscillation cycles per second from beats per hour, with two beats per full oscillation.",
  inputs: [
    {
      id: "beatsPerHour",
      kind: "number",
      label: "Beats Per Hour",
      unit: "bph",
      minimum: 0,
    },
  ],
  outputs: [{ id: "hertz", kind: "number", label: "Hertz", unit: "Hz" }],
  calculate: (input) =>
    calculateBphToHertz({
      beatsPerHour: input.beatsPerHour as number,
    }),
});
export const bphToHertzTool = tool;
export const runBphToHertz = tool.execute;
export default tool;

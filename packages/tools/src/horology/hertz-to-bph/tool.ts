import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HertzToBphInput = Readonly<{
  readonly hertz: number;
}>;
export type HertzToBphOutput = Readonly<{
  readonly beatsPerHour: number;
}>;

export const calculateHertzToBph = (x: HertzToBphInput): HertzToBphOutput => {
  if (!Number.isFinite(x.hertz) || x.hertz <= 0)
    simpleError("hertz", "Provide a finite positive number.");
  const beatsPerHour = 7200 * x.hertz;
  if (!Number.isFinite(beatsPerHour))
    simpleError(
      "beatsPerHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { beatsPerHour: Object.is(beatsPerHour, -0) ? 0 : beatsPerHour };
};

export const example = {
  input: {
    hertz: 4,
  },
  output: { beatsPerHour: 28800 },
} satisfies ToolExample<HertzToBphInput, HertzToBphOutput>;

export const tool = createSimpleTool({
  id: "horology/hertz-to-bph",
  title: "Hertz To Bph",
  description:
    "Watch beats per hour from full balance oscillations per second, with two beats per cycle.",
  inputs: [
    { id: "hertz", kind: "number", label: "Hertz", unit: "Hz", minimum: 0 },
  ],
  outputs: [
    {
      id: "beatsPerHour",
      kind: "number",
      label: "Beats Per Hour",
      unit: "bph",
    },
  ],
  calculate: (input) =>
    calculateHertzToBph({
      hertz: input.hertz as number,
    }),
});
export const hertzToBphTool = tool;
export const runHertzToBph = tool.execute;
export default tool;

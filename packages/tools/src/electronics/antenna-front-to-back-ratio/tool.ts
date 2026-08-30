import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AntennaFrontToBackRatioInput = Readonly<{
  readonly frontWatts: number;
  readonly backWatts: number;
}>;
export type AntennaFrontToBackRatioOutput = Readonly<{
  readonly ratioDecibels: number;
}>;

export const calculateAntennaFrontToBackRatio = (
  x: AntennaFrontToBackRatioInput,
): AntennaFrontToBackRatioOutput => {
  if (!Number.isFinite(x.frontWatts) || x.frontWatts < 0)
    simpleError("frontWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.backWatts) || x.backWatts < 0)
    simpleError("backWatts", "Provide a finite number at least 0.");
  const ratioDecibels = 10 * Math.log10(x.frontWatts / x.backWatts);
  if (!Number.isFinite(ratioDecibels))
    simpleError(
      "ratioDecibels",
      "Inputs produce an undefined or non-finite result.",
    );
  return { ratioDecibels: Object.is(ratioDecibels, -0) ? 0 : ratioDecibels };
};

export const example = {
  input: { frontWatts: 100, backWatts: 1 },
  output: { ratioDecibels: 20 },
} satisfies ToolExample<
  AntennaFrontToBackRatioInput,
  AntennaFrontToBackRatioOutput
>;

export const tool = createSimpleTool({
  id: "electronics/antenna-front-to-back-ratio",
  title: "Antenna Front To Back Ratio",
  description:
    "Directional front-to-back radiation ratio from same-distance power measurements in the two directions.",
  inputs: [
    {
      id: "frontWatts",
      kind: "number",
      label: "Front Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "backWatts",
      kind: "number",
      label: "Back Watts",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "ratioDecibels",
      kind: "number",
      label: "Ratio Decibels",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateAntennaFrontToBackRatio({
      frontWatts: input.frontWatts as number,
      backWatts: input.backWatts as number,
    }),
});
export const antennaFrontToBackRatioTool = tool;
export const runAntennaFrontToBackRatio = tool.execute;
export default tool;

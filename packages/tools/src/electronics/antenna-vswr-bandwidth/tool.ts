import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AntennaVswrBandwidthInput = Readonly<{
  readonly lowerHertz: number;
  readonly upperHertz: number;
}>;
export type AntennaVswrBandwidthOutput = Readonly<{
  readonly fractionalBandwidthPercent: number;
}>;

export const calculateAntennaVswrBandwidth = (
  x: AntennaVswrBandwidthInput,
): AntennaVswrBandwidthOutput => {
  if (!Number.isFinite(x.lowerHertz) || x.lowerHertz < 0)
    simpleError("lowerHertz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.upperHertz) || x.upperHertz < 0)
    simpleError("upperHertz", "Provide a finite number at least 0.");
  if (x.upperHertz <= x.lowerHertz)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const fractionalBandwidthPercent =
    (200 * (x.upperHertz - x.lowerHertz)) / (x.upperHertz + x.lowerHertz);
  if (!Number.isFinite(fractionalBandwidthPercent))
    simpleError(
      "fractionalBandwidthPercent",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    fractionalBandwidthPercent: Object.is(fractionalBandwidthPercent, -0)
      ? 0
      : fractionalBandwidthPercent,
  };
};

export const example = {
  input: { lowerHertz: 900000000, upperHertz: 1100000000 },
  output: { fractionalBandwidthPercent: 20 },
} satisfies ToolExample<AntennaVswrBandwidthInput, AntennaVswrBandwidthOutput>;

export const tool = createSimpleTool({
  id: "electronics/antenna-vswr-bandwidth",
  title: "Antenna VSWR Bandwidth",
  description:
    "Fractional bandwidth between measured lower and upper frequencies that both meet a chosen VSWR limit.",
  inputs: [
    {
      id: "lowerHertz",
      kind: "number",
      label: "Lower Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "upperHertz",
      kind: "number",
      label: "Upper Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "fractionalBandwidthPercent",
      kind: "number",
      label: "Fractional Bandwidth Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateAntennaVswrBandwidth({
      lowerHertz: input.lowerHertz as number,
      upperHertz: input.upperHertz as number,
    }),
});
export const antennaVswrBandwidthTool = tool;
export const runAntennaVswrBandwidth = tool.execute;
export default tool;

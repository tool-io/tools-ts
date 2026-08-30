import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AntennaSidelobeLevelInput = Readonly<{
  readonly mainPeakWatts: number;
  readonly sidelobePeakWatts: number;
}>;
export type AntennaSidelobeLevelOutput = Readonly<{
  readonly sidelobeDbc: number;
}>;

export const calculateAntennaSidelobeLevel = (
  x: AntennaSidelobeLevelInput,
): AntennaSidelobeLevelOutput => {
  if (!Number.isFinite(x.mainPeakWatts) || x.mainPeakWatts < 0)
    simpleError("mainPeakWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.sidelobePeakWatts) || x.sidelobePeakWatts < 0)
    simpleError("sidelobePeakWatts", "Provide a finite number at least 0.");
  if (x.sidelobePeakWatts > x.mainPeakWatts)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const sidelobeDbc = 10 * Math.log10(x.sidelobePeakWatts / x.mainPeakWatts);
  if (!Number.isFinite(sidelobeDbc))
    simpleError(
      "sidelobeDbc",
      "Inputs produce an undefined or non-finite result.",
    );
  return { sidelobeDbc: Object.is(sidelobeDbc, -0) ? 0 : sidelobeDbc };
};

export const example = {
  input: { mainPeakWatts: 100, sidelobePeakWatts: 1 },
  output: { sidelobeDbc: -20 },
} satisfies ToolExample<AntennaSidelobeLevelInput, AntennaSidelobeLevelOutput>;

export const tool = createSimpleTool({
  id: "electronics/antenna-sidelobe-level",
  title: "Antenna Sidelobe Level",
  description:
    "Sidelobe level relative to the main-lobe peak from linear same-reference power measurements.",
  inputs: [
    {
      id: "mainPeakWatts",
      kind: "number",
      label: "Main Peak Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "sidelobePeakWatts",
      kind: "number",
      label: "Sidelobe Peak Watts",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "sidelobeDbc", kind: "number", label: "Sidelobe Dbc", unit: "dBc" },
  ],
  calculate: (input) =>
    calculateAntennaSidelobeLevel({
      mainPeakWatts: input.mainPeakWatts as number,
      sidelobePeakWatts: input.sidelobePeakWatts as number,
    }),
});
export const antennaSidelobeLevelTool = tool;
export const runAntennaSidelobeLevel = tool.execute;
export default tool;

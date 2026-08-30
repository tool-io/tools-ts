import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DisplayRefreshPowerInput = Readonly<{
  readonly energyPerRefreshJ: number;
  readonly refreshRateHz: number;
}>;
export type DisplayRefreshPowerOutput = Readonly<{
  readonly dynamicRefreshPowerW: number;
}>;

export const calculateDisplayRefreshPower = (
  x: DisplayRefreshPowerInput,
): DisplayRefreshPowerOutput => {
  if (!Number.isFinite(x.energyPerRefreshJ) || x.energyPerRefreshJ < 0)
    simpleError("energyPerRefreshJ", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.refreshRateHz) || x.refreshRateHz < 0)
    simpleError("refreshRateHz", "Provide a finite number at least 0.");
  const dynamicRefreshPowerW = x.energyPerRefreshJ * x.refreshRateHz;
  if (!Number.isFinite(dynamicRefreshPowerW))
    simpleError(
      "dynamicRefreshPowerW",
      "The inputs produce an invalid result.",
    );
  return {
    dynamicRefreshPowerW: Object.is(dynamicRefreshPowerW, -0)
      ? 0
      : dynamicRefreshPowerW,
  };
};

export const example = {
  input: { energyPerRefreshJ: 0.002, refreshRateHz: 60 },
  output: { dynamicRefreshPowerW: 0.12 },
} satisfies ToolExample<DisplayRefreshPowerInput, DisplayRefreshPowerOutput>;

export const tool = createSimpleTool({
  id: "electronics/display-refresh-power",
  title: "Display Refresh Power",
  description:
    "Estimate only the dynamic energy-per-frame component of display power from measured refresh energy and refresh rate.",
  inputs: [
    {
      id: "energyPerRefreshJ",
      kind: "number",
      label: "Energy per refresh",
      unit: "J",
      minimum: 0,
    },
    {
      id: "refreshRateHz",
      kind: "number",
      label: "Refresh rate",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "dynamicRefreshPowerW",
      kind: "number",
      label: "Dynamic refresh power",
      unit: "W",
    },
  ],
  calculate: (input) =>
    calculateDisplayRefreshPower({
      energyPerRefreshJ: input.energyPerRefreshJ as number,
      refreshRateHz: input.refreshRateHz as number,
    }),
});
export const displayRefreshPowerTool = tool;
export const runDisplayRefreshPower = tool.execute;
export default tool;

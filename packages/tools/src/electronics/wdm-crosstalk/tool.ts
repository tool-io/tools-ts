import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WdmCrosstalkInput = Readonly<{
  readonly unwantedPowerW: number;
  readonly wantedPowerW: number;
}>;
export type WdmCrosstalkOutput = Readonly<{
  readonly crosstalkDb: number;
}>;

export const calculateWdmCrosstalk = (
  x: WdmCrosstalkInput,
): WdmCrosstalkOutput => {
  if (!Number.isFinite(x.unwantedPowerW) || x.unwantedPowerW < 0)
    simpleError("unwantedPowerW", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wantedPowerW) || x.wantedPowerW < 0)
    simpleError("wantedPowerW", "Provide a finite number at least 0.");
  if (!(x.unwantedPowerW > 0 && x.wantedPowerW > 0))
    simpleError("input", "Both optical powers must be positive.");
  const crosstalkDb = 10 * Math.log10(x.unwantedPowerW / x.wantedPowerW);
  if (!Number.isFinite(crosstalkDb))
    simpleError("crosstalkDb", "The inputs produce an invalid result.");
  return { crosstalkDb: Object.is(crosstalkDb, -0) ? 0 : crosstalkDb };
};

export const example = {
  input: { unwantedPowerW: 0.00001, wantedPowerW: 0.001 },
  output: { crosstalkDb: -20 },
} satisfies ToolExample<WdmCrosstalkInput, WdmCrosstalkOutput>;

export const tool = createSimpleTool({
  id: "electronics/wdm-crosstalk",
  title: "WDM Crosstalk",
  description:
    "Express unwanted-to-wanted optical power ratio as crosstalk in decibels; negative values mean interference is below the signal.",
  inputs: [
    {
      id: "unwantedPowerW",
      kind: "number",
      label: "Interfering optical power",
      unit: "W",
      minimum: 0,
    },
    {
      id: "wantedPowerW",
      kind: "number",
      label: "Wanted optical power",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "crosstalkDb", kind: "number", label: "Crosstalk", unit: "dB" },
  ],
  calculate: (input) =>
    calculateWdmCrosstalk({
      unwantedPowerW: input.unwantedPowerW as number,
      wantedPowerW: input.wantedPowerW as number,
    }),
});
export const wdmCrosstalkTool = tool;
export const runWdmCrosstalk = tool.execute;
export default tool;

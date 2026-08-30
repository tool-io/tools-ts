import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DisplayBacklightCurrentInput = Readonly<{
  readonly backlightPowerW: number;
  readonly supplyVoltageV: number;
}>;
export type DisplayBacklightCurrentOutput = Readonly<{
  readonly supplyCurrentA: number;
}>;

export const calculateDisplayBacklightCurrent = (
  x: DisplayBacklightCurrentInput,
): DisplayBacklightCurrentOutput => {
  if (!Number.isFinite(x.backlightPowerW) || x.backlightPowerW < 0)
    simpleError("backlightPowerW", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.supplyVoltageV) || x.supplyVoltageV < 0)
    simpleError("supplyVoltageV", "Provide a finite number at least 0.");
  if (!(x.supplyVoltageV > 0))
    simpleError("supplyVoltageV", "Supply voltage must be positive.");
  const supplyCurrentA = x.backlightPowerW / x.supplyVoltageV;
  if (!Number.isFinite(supplyCurrentA))
    simpleError("supplyCurrentA", "The inputs produce an invalid result.");
  return { supplyCurrentA: Object.is(supplyCurrentA, -0) ? 0 : supplyCurrentA };
};

export const example = {
  input: { backlightPowerW: 5, supplyVoltageV: 5 },
  output: { supplyCurrentA: 1 },
} satisfies ToolExample<
  DisplayBacklightCurrentInput,
  DisplayBacklightCurrentOutput
>;

export const tool = createSimpleTool({
  id: "electronics/display-backlight-current",
  title: "Display Backlight Current",
  description:
    "Calculate average backlight supply current from measured electrical power and supply voltage.",
  inputs: [
    {
      id: "backlightPowerW",
      kind: "number",
      label: "Electrical backlight power",
      unit: "W",
      minimum: 0,
    },
    {
      id: "supplyVoltageV",
      kind: "number",
      label: "Backlight supply voltage",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "supplyCurrentA",
      kind: "number",
      label: "Average supply current",
      unit: "A",
    },
  ],
  calculate: (input) =>
    calculateDisplayBacklightCurrent({
      backlightPowerW: input.backlightPowerW as number,
      supplyVoltageV: input.supplyVoltageV as number,
    }),
});
export const displayBacklightCurrentTool = tool;
export const runDisplayBacklightCurrent = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PaSaturatedPowerInput = Readonly<{
  readonly saturatedRmsVolts: number;
  readonly loadOhms: number;
}>;
export type PaSaturatedPowerOutput = Readonly<{
  readonly saturatedWatts: number;
}>;

export const calculatePaSaturatedPower = (
  x: PaSaturatedPowerInput,
): PaSaturatedPowerOutput => {
  if (!Number.isFinite(x.saturatedRmsVolts) || x.saturatedRmsVolts < 0)
    simpleError("saturatedRmsVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.loadOhms) || x.loadOhms < 0)
    simpleError("loadOhms", "Provide a finite number at least 0.");
  const saturatedWatts = x.saturatedRmsVolts ** 2 / x.loadOhms;
  if (!Number.isFinite(saturatedWatts))
    simpleError(
      "saturatedWatts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { saturatedWatts: Object.is(saturatedWatts, -0) ? 0 : saturatedWatts };
};

export const example = {
  input: { saturatedRmsVolts: 10, loadOhms: 50 },
  output: { saturatedWatts: 2 },
} satisfies ToolExample<PaSaturatedPowerInput, PaSaturatedPowerOutput>;

export const tool = createSimpleTool({
  id: "electronics/pa-saturated-power",
  title: "PA Saturated Power",
  description:
    "RF output power at an observed saturated operating point from measured sinusoidal RMS output voltage into a resistive load.",
  inputs: [
    {
      id: "saturatedRmsVolts",
      kind: "number",
      label: "Saturated Rms Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "loadOhms",
      kind: "number",
      label: "Load Ohms",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "saturatedWatts",
      kind: "number",
      label: "Saturated Watts",
      unit: "W",
    },
  ],
  calculate: (input) =>
    calculatePaSaturatedPower({
      saturatedRmsVolts: input.saturatedRmsVolts as number,
      loadOhms: input.loadOhms as number,
    }),
});
export const paSaturatedPowerTool = tool;
export const runPaSaturatedPower = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PowerModuleLossConductionInput = Readonly<{
  readonly rmsCurrentAmperes: number;
  readonly onResistanceOhms: number;
}>;
export type PowerModuleLossConductionOutput = Readonly<{
  conductionLossW: number;
}>;

export const calculatePowerModuleLossConduction = (
  i: PowerModuleLossConductionInput,
): PowerModuleLossConductionOutput => {
  const direct = i.rmsCurrentAmperes ** 2 * i.onResistanceOhms;
  const value =
    Number.isFinite(direct) &&
    (direct !== 0 || i.rmsCurrentAmperes === 0 || i.onResistanceOhms === 0)
      ? direct
      : i.rmsCurrentAmperes * i.onResistanceOhms * i.rmsCurrentAmperes;
  if (!Number.isFinite(value))
    simpleError("conductionLossW", "The inputs produce a non-finite result.");
  return { conductionLossW: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { rmsCurrentAmperes: 20, onResistanceOhms: 0.05 },
  output: { conductionLossW: 20 },
} satisfies ToolExample<
  PowerModuleLossConductionInput,
  PowerModuleLossConductionOutput
>;

export const tool = createSimpleTool({
  id: "electronics/power-module-loss-conduction",
  title: "Power Module Loss Conduction",
  description:
    "Estimate resistive power-module conduction loss as RMS current squared times hot on-state resistance; use the operating-temperature resistance.",
  inputs: [
    {
      id: "rmsCurrentAmperes",
      kind: "number",
      label: "RMS Current (A)",
      unit: "A",
      minimum: 0,
    },
    {
      id: "onResistanceOhms",
      kind: "number",
      label: "On Resistance (Ω)",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "conductionLossW",
      kind: "number",
      label: "Conduction Loss (W)",
      unit: "W",
    },
  ],
  calculate: (input) =>
    calculatePowerModuleLossConduction({
      rmsCurrentAmperes: input.rmsCurrentAmperes as number,
      onResistanceOhms: input.onResistanceOhms as number,
    }),
});
export const powerModuleLossConductionTool = tool;
export const runPowerModuleLossConduction = tool.execute;
export default tool;

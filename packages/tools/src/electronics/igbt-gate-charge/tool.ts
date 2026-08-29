import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IgbtGateChargeInput = Readonly<{
  readonly gateCurrentAmperes: number;
  readonly chargeDurationSeconds: number;
}>;
export type IgbtGateChargeOutput = Readonly<{ gateChargeCoulombs: number }>;

export const calculateIgbtGateCharge = (
  i: IgbtGateChargeInput,
): IgbtGateChargeOutput => {
  const value = i.gateCurrentAmperes * i.chargeDurationSeconds;
  if (!Number.isFinite(value))
    simpleError(
      "gateChargeCoulombs",
      "The inputs produce a non-finite result.",
    );
  return { gateChargeCoulombs: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { gateCurrentAmperes: 0.5, chargeDurationSeconds: 2e-7 },
  output: { gateChargeCoulombs: 1e-7 },
} satisfies ToolExample<IgbtGateChargeInput, IgbtGateChargeOutput>;

export const tool = createSimpleTool({
  id: "electronics/igbt-gate-charge",
  title: "IGBT Gate Charge",
  description:
    "Estimate IGBT gate charge as constant gate-drive current times charging duration; actual current waveforms require integration.",
  inputs: [
    {
      id: "gateCurrentAmperes",
      kind: "number",
      label: "Gate Current (A)",
      unit: "A",
      minimum: 0,
    },
    {
      id: "chargeDurationSeconds",
      kind: "number",
      label: "Charge Duration (s)",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "gateChargeCoulombs",
      kind: "number",
      label: "Gate Charge (C)",
      unit: "C",
    },
  ],
  calculate: (input) =>
    calculateIgbtGateCharge({
      gateCurrentAmperes: input.gateCurrentAmperes as number,
      chargeDurationSeconds: input.chargeDurationSeconds as number,
    }),
});
export const igbtGateChargeTool = tool;
export const runIgbtGateCharge = tool.execute;
export default tool;

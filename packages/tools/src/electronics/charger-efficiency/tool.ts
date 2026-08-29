import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChargerEfficiencyInput = Readonly<{
  readonly deliveredEnergyWh: number;
  readonly inputEnergyWh: number;
}>;
export type ChargerEfficiencyOutput = Readonly<{ efficiencyPercent: number }>;

export const calculateChargerEfficiency = (
  i: ChargerEfficiencyInput,
): ChargerEfficiencyOutput => {
  if (i.deliveredEnergyWh > i.inputEnergyWh)
    simpleError(
      "deliveredEnergyWh",
      "Delivered energy cannot exceed input energy in this model.",
    );
  const value = (100 * i.deliveredEnergyWh) / i.inputEnergyWh;
  if (!Number.isFinite(value))
    simpleError("efficiencyPercent", "The inputs produce a non-finite result.");
  return { efficiencyPercent: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { deliveredEnergyWh: 80, inputEnergyWh: 100 },
  output: { efficiencyPercent: 80 },
} satisfies ToolExample<ChargerEfficiencyInput, ChargerEfficiencyOutput>;

export const tool = createSimpleTool({
  id: "electronics/charger-efficiency",
  title: "Charger Efficiency",
  description:
    "Calculate charger energy efficiency as delivered battery energy divided by input energy over the same charging interval, expressed as a percentage.",
  inputs: [
    {
      id: "deliveredEnergyWh",
      kind: "number",
      label: "Delivered (Wh)",
      unit: "Wh",
      minimum: 0,
    },
    {
      id: "inputEnergyWh",
      kind: "number",
      label: "Input (Wh)",
      unit: "Wh",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "efficiencyPercent",
      kind: "number",
      label: "Efficiency (%)",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateChargerEfficiency({
      deliveredEnergyWh: input.deliveredEnergyWh as number,
      inputEnergyWh: input.inputEnergyWh as number,
    }),
});
export const chargerEfficiencyTool = tool;
export const runChargerEfficiency = tool.execute;
export default tool;

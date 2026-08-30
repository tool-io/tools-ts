import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PumpEfficiencyInput = Readonly<{
  readonly hydraulicPowerWatts: number;
  readonly shaftPowerWatts: number;
}>;
export type PumpEfficiencyOutput = Readonly<{
  readonly efficiencyPercent: number;
}>;

export const calculatePumpEfficiency = (
  x: PumpEfficiencyInput,
): PumpEfficiencyOutput => {
  if (!Number.isFinite(x.hydraulicPowerWatts) || x.hydraulicPowerWatts < 0)
    simpleError("hydraulicPowerWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.shaftPowerWatts) || x.shaftPowerWatts < 0)
    simpleError("shaftPowerWatts", "Provide a finite number at least 0.");
  if (x.hydraulicPowerWatts > x.shaftPowerWatts)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const efficiencyPercent = (100 * x.hydraulicPowerWatts) / x.shaftPowerWatts;
  if (!Number.isFinite(efficiencyPercent))
    simpleError(
      "efficiencyPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    efficiencyPercent: Object.is(efficiencyPercent, -0) ? 0 : efficiencyPercent,
  };
};

export const example = {
  input: { hydraulicPowerWatts: 800, shaftPowerWatts: 1000 },
  output: { efficiencyPercent: 80 },
} satisfies ToolExample<PumpEfficiencyInput, PumpEfficiencyOutput>;

export const tool = createSimpleTool({
  id: "engineering/pump-efficiency",
  title: "Pump Efficiency",
  description:
    "Pump hydraulic efficiency from hydraulic output power divided by shaft input power.",
  inputs: [
    {
      id: "hydraulicPowerWatts",
      kind: "number",
      label: "Hydraulic Power Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "shaftPowerWatts",
      kind: "number",
      label: "Shaft Power Watts",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "efficiencyPercent",
      kind: "number",
      label: "Efficiency Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculatePumpEfficiency({
      hydraulicPowerWatts: input.hydraulicPowerWatts as number,
      shaftPowerWatts: input.shaftPowerWatts as number,
    }),
});
export const pumpEfficiencyTool = tool;
export const runPumpEfficiency = tool.execute;
export default tool;

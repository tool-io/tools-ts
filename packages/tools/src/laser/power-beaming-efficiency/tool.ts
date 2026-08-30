import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly electricalInputPowerWatts: number;
  readonly deliveredOpticalPowerWatts: number;
}>;
export type Output = Readonly<{
  readonly endToEndEfficiencyPercent: number;
  readonly powerLossWatts: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.electricalInputPowerWatts <= 0)
    simpleError(
      "electricalInputPowerWatts",
      "Electrical input power must be positive.",
      "invalid_input_power",
    );
  return {
    endToEndEfficiencyPercent:
      (input.deliveredOpticalPowerWatts / input.electricalInputPowerWatts) *
      100,
    powerLossWatts:
      input.electricalInputPowerWatts - input.deliveredOpticalPowerWatts,
  };
};

export const exampleInput = {
  electricalInputPowerWatts: 100,
  deliveredOpticalPowerWatts: 30,
} satisfies Input;
export const exampleOutput = {
  endToEndEfficiencyPercent: 30,
  powerLossWatts: 70,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      electricalInputPowerWatts: input.electricalInputPowerWatts as number,
      deliveredOpticalPowerWatts: input.deliveredOpticalPowerWatts as number,
    }),
  description:
    "Calculate end-to-end optical power-beaming efficiency and power loss.",
  id: "laser/power-beaming-efficiency",
  inputs: [
    {
      id: "electricalInputPowerWatts",
      label: "Electrical input power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "deliveredOpticalPowerWatts",
      label: "Delivered optical power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
  ],
  outputs: [
    {
      id: "endToEndEfficiencyPercent",
      label: "End-to-end efficiency",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    { id: "powerLossWatts", label: "Power loss", kind: "number", unit: "W" },
  ],
  title: "Power-Beaming Efficiency",
});

export const run = tool.execute;
export default tool;

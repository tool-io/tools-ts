import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AntennaEfficiencyInput = {
  readonly lossResistanceOhms: number;
  readonly radiationResistanceOhms: number;
};

export type AntennaEfficiencyOutput = {
  readonly antennaEfficiencyPercent: number;
};

export const antennaEfficiencyExample = {
  input: { lossResistanceOhms: 25, radiationResistanceOhms: 75 },
  output: { antennaEfficiencyPercent: 75 },
} satisfies ToolExample<AntennaEfficiencyInput, AntennaEfficiencyOutput>;

export const calculateAntennaEfficiency = (
  input: AntennaEfficiencyInput,
): AntennaEfficiencyOutput => {
  if (!(input.radiationResistanceOhms > 0))
    simpleError(
      "radiationResistanceOhms",
      "Radiation resistance must be positive.",
      "invalid_resistance",
    );
  if (!(input.lossResistanceOhms >= 0))
    simpleError(
      "lossResistanceOhms",
      "Loss resistance cannot be negative.",
      "invalid_loss",
    );
  return {
    antennaEfficiencyPercent:
      (input.radiationResistanceOhms /
        (input.radiationResistanceOhms + input.lossResistanceOhms)) *
      100,
  };
};

export const antennaEfficiencyTool = createSimpleTool({
  calculate: (input) =>
    calculateAntennaEfficiency(input as unknown as AntennaEfficiencyInput),
  description:
    "Compute antenna efficiency as radiation resistance over total resistance, expressed as a percentage.",
  id: "electronics/antenna-efficiency",
  inputs: [
    {
      id: "lossResistanceOhms",
      kind: "number",
      label: "Loss resistance",
      unit: "Ω",
    },
    {
      id: "radiationResistanceOhms",
      kind: "number",
      label: "Radiation resistance",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      id: "antennaEfficiencyPercent",
      kind: "number",
      label: "Antenna efficiency",
      unit: "%",
    },
  ],
  title: "Antenna Efficiency %",
});
export const runAntennaEfficiency = antennaEfficiencyTool.execute;
export default antennaEfficiencyTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type TurgorPressureInput = {
  readonly osmoticPotentialMpa: number;
  readonly waterPotentialTotalMpa: number;
};

export type TurgorPressureOutput = {
  readonly turgorPressureMpa: number;
};

export const turgorPressureExample = {
  input: { osmoticPotentialMpa: -1.2, waterPotentialTotalMpa: -0.8 },
  output: { turgorPressureMpa: 0.3999999999999999 },
} satisfies ToolExample<TurgorPressureInput, TurgorPressureOutput>;

export const turgorPressureTool = createSimpleTool({
  id: "biology/turgor-pressure",
  title: "Turgor Pressure Estimate",
  description:
    "Estimate turgor pressure in megapascals as the total water potential minus the osmotic potential, floored at zero when the cell is flaccid; both potentials are signed and finite.",
  inputs: [
    {
      description: "Total (whole-cell) water potential in megapascals.",
      id: "waterPotentialTotalMpa",
      kind: "number",
      label: "Total water potential",
      unit: "MPa",
    },
    {
      description: "Osmotic (solute) potential in megapascals.",
      id: "osmoticPotentialMpa",
      kind: "number",
      label: "Osmotic potential",
      unit: "MPa",
    },
  ],
  outputs: [
    {
      description: "Estimated turgor pressure in megapascals; never negative.",
      id: "turgorPressureMpa",
      kind: "number",
      label: "Turgor pressure",
      unit: "MPa",
    },
  ],
  calculate: (input) => {
    const waterPotentialTotalMpa = input.waterPotentialTotalMpa as number;
    const osmoticPotentialMpa = input.osmoticPotentialMpa as number;
    return {
      turgorPressureMpa: Math.max(
        0,
        waterPotentialTotalMpa - osmoticPotentialMpa,
      ),
    };
  },
});
export const runTurgorPressure = turgorPressureTool.execute;
export default turgorPressureTool;

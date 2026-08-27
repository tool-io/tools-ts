import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const JOULES_PER_TON_TNT = 4.184e9;

export type SeismicEnergyInput = {
  readonly magnitude: number;
};

export type SeismicEnergyOutput = {
  readonly energyJoules: number;
  readonly energyTonsTnt: number;
};

export const calculateSeismicEnergy = (
  input: SeismicEnergyInput,
): SeismicEnergyOutput => {
  if (!Number.isFinite(input.magnitude))
    simpleError(
      "magnitude",
      "Magnitude must be a finite number.",
      "invalid_magnitude",
    );
  const energyJoules = Math.pow(10, 1.5 * input.magnitude + 4.8);
  return { energyJoules, energyTonsTnt: energyJoules / JOULES_PER_TON_TNT };
};

export const seismicEnergyExample = {
  input: { magnitude: 6 },
  output: {
    energyJoules: 63095734448019.43,
    energyTonsTnt: 15080.242458895656,
  },
} satisfies ToolExample<SeismicEnergyInput, SeismicEnergyOutput>;

export const seismicEnergyTool = createSimpleTool({
  id: "geology/seismic-energy",
  title: "Seismic Energy Calculator",
  description:
    "Gutenberg-Richter energy relation log10 E = 1.5 M + 4.8 with E in joules, also expressed in tons of TNT (4.184e9 joules per ton).",
  inputs: [
    {
      description: "Earthquake magnitude (Richter or moment magnitude).",
      id: "magnitude",
      kind: "number",
      label: "Magnitude",
    },
  ],
  outputs: [
    {
      description: "Radiated seismic energy in joules.",
      id: "energyJoules",
      kind: "number",
      label: "Energy",
    },
    {
      description: "Equivalent mass of TNT in metric tons.",
      id: "energyTonsTnt",
      kind: "number",
      label: "Tons TNT",
    },
  ],
  calculate: (input) =>
    calculateSeismicEnergy(input as unknown as SeismicEnergyInput),
});

export const runSeismicEnergy = seismicEnergyTool.execute;
export default seismicEnergyTool;

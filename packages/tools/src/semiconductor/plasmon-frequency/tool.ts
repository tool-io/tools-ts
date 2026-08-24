import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PlasmonFrequencyInput = {
  readonly electronDensityPerM3: number;
};

export type PlasmonFrequencyOutput = {
  readonly plasmaAngularFrequencyRadPerS: number;
  readonly terahertzFrequency: number;
};

const ELEMENTARY_CHARGE_C = 1.602176634e-19;
const VACUUM_PERMITTIVITY_F_PER_M = 8.854187817e-12;
const ELECTRON_MASS_KG = 9.1093837015e-31;

export const plasmonFrequencyExample = {
  input: { electronDensityPerM3: 1e29 },
  output: {
    plasmaAngularFrequencyRadPerS: 17839863655559650,
    terahertzFrequency: 2839.3024848677683,
  },
} satisfies ToolExample<PlasmonFrequencyInput, PlasmonFrequencyOutput>;

export const calculatePlasmonFrequency = (
  input: PlasmonFrequencyInput,
): PlasmonFrequencyOutput => {
  if (
    !Number.isFinite(input.electronDensityPerM3) ||
    input.electronDensityPerM3 <= 0
  )
    simpleError(
      "electronDensityPerM3",
      "Electron density must be finite and positive.",
    );
  const omegaRadPerS = Math.sqrt(
    (input.electronDensityPerM3 * ELEMENTARY_CHARGE_C * ELEMENTARY_CHARGE_C) /
      (VACUUM_PERMITTIVITY_F_PER_M * ELECTRON_MASS_KG),
  );
  if (!Number.isFinite(omegaRadPerS) || omegaRadPerS <= 0)
    simpleError(
      "electronDensityPerM3",
      "The plasma frequency is outside the representable range.",
      "numeric_range",
    );
  return {
    plasmaAngularFrequencyRadPerS: omegaRadPerS,
    terahertzFrequency: omegaRadPerS / (2 * Math.PI * 1e12),
  };
};

export const plasmonFrequencyTool = createSimpleTool({
  calculate: (input) =>
    calculatePlasmonFrequency({
      electronDensityPerM3: input.electronDensityPerM3 as number,
    }),
  description:
    "Compute the classical plasma angular frequency and terahertz frequency of an electron gas from its density.",
  id: "semiconductor/plasmon-frequency",
  inputs: [
    {
      description: "Free electron density.",
      format: "density-per-m3",
      id: "electronDensityPerM3",
      kind: "number",
      label: "Electron density",
      minimum: Number.MIN_VALUE,
      unit: "m^-3",
    },
  ],
  outputs: [
    {
      description: "Plasma angular frequency.",
      id: "plasmaAngularFrequencyRadPerS",
      kind: "number",
      label: "Plasma angular frequency",
      minimum: Number.MIN_VALUE,
      unit: "rad/s",
    },
    {
      description: "Plasma frequency in terahertz.",
      format: "frequency",
      id: "terahertzFrequency",
      kind: "number",
      label: "Terahertz frequency",
      minimum: Number.MIN_VALUE,
      unit: "THz",
    },
  ],
  title: "Plasmon Frequency Calculator",
});
export const runPlasmonFrequency = plasmonFrequencyTool.execute;
export default plasmonFrequencyTool;

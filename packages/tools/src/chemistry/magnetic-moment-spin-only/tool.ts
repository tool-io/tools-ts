import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MagneticMomentSpinOnlyInput = {
  readonly unpairedElectrons: number;
};

export type MagneticMomentSpinOnlyOutput = {
  readonly magneticMomentBohrMagneton: number;
};

export const magneticMomentSpinOnlyExample = {
  input: { unpairedElectrons: 5 },
  output: { magneticMomentBohrMagneton: 5.916079783099616 },
} satisfies ToolExample<
  MagneticMomentSpinOnlyInput,
  MagneticMomentSpinOnlyOutput
>;

export const calculateMagneticMomentSpinOnly = (
  input: MagneticMomentSpinOnlyInput,
): MagneticMomentSpinOnlyOutput => ({
  magneticMomentBohrMagneton: Math.sqrt(
    input.unpairedElectrons * (input.unpairedElectrons + 2),
  ),
});

export const MagneticMomentSpinOnlyTool = createSimpleTool({
  calculate: (input) =>
    calculateMagneticMomentSpinOnly(
      input as unknown as MagneticMomentSpinOnlyInput,
    ),
  description:
    "Compute the spin-only magnetic moment mu = sqrt(n*(n+2)) in Bohr magnetons for n unpaired electrons.",
  id: "chemistry/magnetic-moment-spin-only",
  inputs: [
    {
      description: "Number of unpaired d electrons on the metal centre.",
      id: "unpairedElectrons",
      kind: "integer",
      label: "Unpaired electrons",
      maximum: 10,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Spin-only magnetic moment.",
      id: "magneticMomentBohrMagneton",
      kind: "number",
      label: "Magnetic moment",
      unit: "μB",
    },
  ],
  title: "Spin-Only Magnetic Moment Calculator",
});
export const runMagneticMomentSpinOnly = MagneticMomentSpinOnlyTool.execute;
export default MagneticMomentSpinOnlyTool;

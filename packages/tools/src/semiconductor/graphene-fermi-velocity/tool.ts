import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GrapheneFermiVelocityInput = Readonly<{
  readonly energyElectronVolts: number;
  readonly waveVectorInverseMeters: number;
}>;
export type GrapheneFermiVelocityOutput = Readonly<{
  readonly velocityMetersPerSecond: number;
}>;

export const calculateGrapheneFermiVelocity = (
  x: GrapheneFermiVelocityInput,
): GrapheneFermiVelocityOutput => {
  if (!Number.isFinite(x.energyElectronVolts) || x.energyElectronVolts < 0)
    simpleError("energyElectronVolts", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.waveVectorInverseMeters) ||
    x.waveVectorInverseMeters < 0
  )
    simpleError(
      "waveVectorInverseMeters",
      "Provide a finite number at least 0.",
    );
  const velocityMetersPerSecond =
    (x.energyElectronVolts * 1.602176634e-19) /
    (1.054571817e-34 * x.waveVectorInverseMeters);
  if (!Number.isFinite(velocityMetersPerSecond))
    simpleError(
      "velocityMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    velocityMetersPerSecond: Object.is(velocityMetersPerSecond, -0)
      ? 0
      : velocityMetersPerSecond,
  };
};

export const example = {
  input: { energyElectronVolts: 0.1, waveVectorInverseMeters: 150000000 },
  output: { velocityMetersPerSecond: 1012844.9658730072 },
} satisfies ToolExample<
  GrapheneFermiVelocityInput,
  GrapheneFermiVelocityOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/graphene-fermi-velocity",
  title: "Graphene Fermi Velocity",
  description:
    "Graphene Dirac-band Fermi velocity from energy relative to the Dirac point and wave-vector magnitude, assuming linear dispersion E=ℏvF k.",
  inputs: [
    {
      id: "energyElectronVolts",
      kind: "number",
      label: "Energy Electron Volts",
      unit: "eV",
      minimum: 0,
    },
    {
      id: "waveVectorInverseMeters",
      kind: "number",
      label: "Wave Vector Inverse Meters",
      unit: "m⁻¹",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "velocityMetersPerSecond",
      kind: "number",
      label: "Velocity Meters Per Second",
      unit: "m/s",
    },
  ],
  calculate: (input) =>
    calculateGrapheneFermiVelocity({
      energyElectronVolts: input.energyElectronVolts as number,
      waveVectorInverseMeters: input.waveVectorInverseMeters as number,
    }),
});
export const grapheneFermiVelocityTool = tool;
export const runGrapheneFermiVelocity = tool.execute;
export default tool;

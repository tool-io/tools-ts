import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DensityOfStatesEffectiveInput = {
  readonly temperatureK: number;
};

export type DensityOfStatesEffectiveOutput = {
  readonly conductionBandDOSPerCm3: number;
};

export const densityOfStatesEffectiveExample = {
  input: { temperatureK: 600 },
  output: { conductionBandDOSPerCm3: 79195959492893330000 },
} satisfies ToolExample<
  DensityOfStatesEffectiveInput,
  DensityOfStatesEffectiveOutput
>;

export const calculateDensityOfStatesEffective = (
  input: DensityOfStatesEffectiveInput,
): DensityOfStatesEffectiveOutput => {
  const temperatureK = input.temperatureK;
  if (!Number.isFinite(temperatureK))
    simpleError(
      "temperatureK",
      "Temperature must be a finite number.",
      "invalid_field",
    );
  if (temperatureK < 1 || temperatureK > 1000)
    simpleError(
      "temperatureK",
      "Temperature must be between 1 K and 1000 K.",
      "invalid_field",
    );

  const conductionBandDOSPerCm3 = 2.8e19 * Math.pow(temperatureK / 300, 1.5);
  if (!Number.isFinite(conductionBandDOSPerCm3))
    simpleError(
      "temperatureK",
      "Density of states overflowed.",
      "numeric_overflow",
    );

  return {
    conductionBandDOSPerCm3:
      conductionBandDOSPerCm3 === 0 ? 0 : conductionBandDOSPerCm3,
  };
};

export const densityOfStatesEffectiveTool = createSimpleTool({
  calculate: (input) =>
    calculateDensityOfStatesEffective({
      temperatureK: input.temperatureK as number,
    }),
  description:
    "Estimate the conduction-band effective density of states from temperature using a 300 K reference of 2.8e19 per cubic centimeter. Formula: Nc(T) [cm^-3] = 2.8e19 · (T [K] / 300)^1.5. Input: 1 ≤ T ≤ 1000 K. Output: Nc > 0 cm^-3. Assumes parabolic band, temperature-independent effective mass, and the 300 K silicon conduction-band reference.",
  id: "semiconductor/density-of-states-effective",
  inputs: [
    {
      description: "Lattice temperature. Must be between 1 K and 1000 K.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      maximum: 1000,
      minimum: 1,
      unit: "K",
    },
  ],
  outputs: [
    {
      description:
        "Conduction-band effective density of states. At least 0 cm^-3.",
      format: "density-per-cm3",
      id: "conductionBandDOSPerCm3",
      kind: "number",
      label: "Nc",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
  ],
  title: "Effective DOS Calculator",
});
export const runDensityOfStatesEffective = densityOfStatesEffectiveTool.execute;
export default densityOfStatesEffectiveTool;

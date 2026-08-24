import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhononLimitedMobilityInput = {
  readonly referenceMobilityCm2PerVs: number;
  readonly referenceTemperatureK: number;
  readonly temperatureK: number;
  readonly temperatureExponent: number;
};

export type PhononLimitedMobilityOutput = {
  readonly mobilityCm2PerVs: number;
};

export const phononLimitedMobilityExample = {
  input: {
    referenceMobilityCm2PerVs: 1400,
    referenceTemperatureK: 300,
    temperatureExponent: -2.42,
    temperatureK: 300,
  },
  output: { mobilityCm2PerVs: 1400 },
} satisfies ToolExample<
  PhononLimitedMobilityInput,
  PhononLimitedMobilityOutput
>;

export const phononLimitedMobilityTool = createSimpleTool({
  calculate: (input) => {
    const temperatureK = input.temperatureK as number;
    const referenceMobility = input.referenceMobilityCm2PerVs as number;
    const referenceTemperatureK = input.referenceTemperatureK as number;
    const temperatureExponent = input.temperatureExponent as number;
    if (!(temperatureK > 0))
      simpleError(
        "temperatureK",
        "Temperature must be positive.",
        "invalid_temperature",
      );
    if (!(referenceMobility > 0))
      simpleError(
        "referenceMobilityCm2PerVs",
        "Reference mobility must be positive.",
        "invalid_reference_mobility",
      );
    if (!(referenceTemperatureK > 0))
      simpleError(
        "referenceTemperatureK",
        "Reference temperature must be positive.",
      );
    if (!(temperatureExponent < 0))
      simpleError(
        "temperatureExponent",
        "Phonon-limited exponent must be negative.",
      );
    return {
      mobilityCm2PerVs:
        referenceMobility *
        Math.pow(temperatureK / referenceTemperatureK, temperatureExponent),
    };
  },
  description:
    "Scale a reference low-field mobility to temperature using the phonon-limited power law with exponent -2.42.",
  id: "semiconductor/phonon-limited-mobility",
  inputs: [
    {
      description: "Lattice temperature.",
      format: "temperature",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      minimum: Number.MIN_VALUE,
      unit: "K",
    },
    {
      description: "Measured mobility at the reference temperature.",
      format: "mobility",
      id: "referenceMobilityCm2PerVs",
      kind: "number",
      label: "Reference mobility",
      minimum: Number.MIN_VALUE,
      unit: "cm^2/Vs",
    },
    {
      description: "Temperature at which the reference mobility was measured.",
      id: "referenceTemperatureK",
      kind: "number",
      label: "Reference temperature",
      minimum: Number.MIN_VALUE,
      unit: "K",
    },
    {
      description: "Calibrated negative exponent in the mobility power law.",
      id: "temperatureExponent",
      kind: "number",
      label: "Temperature exponent",
      maximum: -Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Phonon-limited mobility.",
      format: "mobility",
      id: "mobilityCm2PerVs",
      kind: "number",
      label: "Mobility",
      minimum: Number.MIN_VALUE,
      unit: "cm^2/Vs",
    },
  ],
  title: "Phonon Mobility Calculator",
});
export const runPhononLimitedMobility = phononLimitedMobilityTool.execute;
export default phononLimitedMobilityTool;

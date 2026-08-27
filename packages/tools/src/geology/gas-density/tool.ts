import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GasDensityInput = {
  readonly pressurePa: number;
  readonly temperatureK: number;
  readonly gasGravity?: number;
  readonly zFactor?: number;
};

export type GasDensityOutput = {
  readonly gasDensityKgPerM3: number;
};

const M_AIR_G_PER_MOL = 28.9625;
const R_J_PER_MOL_K = 8.314462618;

export const calculateGasDensity = (
  input: GasDensityInput,
): GasDensityOutput => {
  const { pressurePa, temperatureK } = input;
  const gravity = input.gasGravity ?? 0.7;
  const z = input.zFactor ?? 1;
  if (!(pressurePa > 0))
    simpleError(
      "pressurePa",
      "Pressure must be greater than zero.",
      "invalid_pressure",
    );
  if (!(temperatureK > 0))
    simpleError(
      "temperatureK",
      "Temperature must be greater than zero.",
      "invalid_temperature",
    );
  if (!(gravity > 0))
    simpleError(
      "gasGravity",
      "Gas gravity must be greater than zero.",
      "invalid_gravity",
    );
  if (!(z > 0))
    simpleError(
      "zFactor",
      "Gas compressibility factor must be greater than zero.",
      "invalid_z_factor",
    );
  const molecularWeightKgPerMol = (M_AIR_G_PER_MOL * gravity) / 1000;
  return {
    gasDensityKgPerM3:
      (pressurePa * molecularWeightKgPerMol) /
      (z * R_J_PER_MOL_K * temperatureK),
  };
};

export const gasDensityExample = {
  input: {
    pressurePa: 6_894_757.293168361,
    temperatureK: 322.0388888888889,
    gasGravity: 0.7,
    zFactor: 0.9,
  },
  output: { gasDensityKgPerM3: 58.005350537677145 },
} satisfies ToolExample<GasDensityInput, GasDensityOutput>;

export const gasDensityTool = createSimpleTool({
  id: "geology/gas-density",
  title: "Gas Density Calculator",
  description:
    "Compute natural-gas density from the real-gas law using gas gravity and a compressibility factor.",
  inputs: [
    {
      description: "Absolute gas pressure.",
      id: "pressurePa",
      kind: "number",
      label: "Pressure",
      minimum: 0,
      unit: "Pa",
    },
    {
      description: "Absolute gas temperature.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      minimum: 0,
      unit: "K",
    },
    {
      default: 0.7,
      description: "Specific gravity of the gas (air = 1).",
      id: "gasGravity",
      kind: "number",
      label: "Gas gravity",
      minimum: 0,
    },
    {
      default: 1,
      description: "Gas compressibility factor at the given conditions.",
      id: "zFactor",
      kind: "number",
      label: "Z factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Gas density in kilograms per cubic metre.",
      id: "gasDensityKgPerM3",
      kind: "number",
      label: "Density",
      unit: "kg/m3",
    },
  ],
  calculate: (input) =>
    calculateGasDensity(input as unknown as GasDensityInput),
});

export const runGasDensity = gasDensityTool.execute;
export default gasDensityTool;

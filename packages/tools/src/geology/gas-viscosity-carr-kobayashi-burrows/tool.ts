import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GasViscosityCarrKobayashiBurrowsInput = {
  readonly pressurePa: number;
  readonly temperatureK: number;
  readonly gasGravity?: number;
  readonly zFactor?: number;
};

export type GasViscosityCarrKobayashiBurrowsOutput = {
  readonly gasViscosityPaS: number;
};

const M_AIR_G_PER_MOL = 28.9625;
const R_J_PER_MOL_K = 8.314462618;

export const calculateGasViscosityCarrKobayashiBurrows = (
  input: GasViscosityCarrKobayashiBurrowsInput,
): GasViscosityCarrKobayashiBurrowsOutput => {
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
  const molecularWeightGPerMol = M_AIR_G_PER_MOL * gravity;
  const rankine = temperatureK * 1.8;
  const densityGPerCm3 =
    (pressurePa * (molecularWeightGPerMol / 1000)) /
    (z * R_J_PER_MOL_K * temperatureK) /
    1000;
  const kParameter =
    ((9.4 + 0.02 * molecularWeightGPerMol) * Math.pow(rankine, 1.5)) /
    (209 + 19 * molecularWeightGPerMol + molecularWeightGPerMol ** 2);
  const xParameter = 3.5 + 986 / rankine + 0.01 * molecularWeightGPerMol;
  const yParameter = 2.4 - 0.2 * xParameter;
  const centipoise =
    1e-4 *
    kParameter *
    Math.exp(xParameter * Math.pow(densityGPerCm3, yParameter));
  return { gasViscosityPaS: centipoise * 1e-3 };
};

export const gasViscosityCarrKobayashiBurrowsExample = {
  input: {
    pressurePa: 6_894_757.293168361,
    temperatureK: 322.0388888888889,
    gasGravity: 0.7,
    zFactor: 0.9,
  },
  output: { gasViscosityPaS: 1.544632823782288e-5 },
} satisfies ToolExample<
  GasViscosityCarrKobayashiBurrowsInput,
  GasViscosityCarrKobayashiBurrowsOutput
>;

export const gasViscosityCarrKobayashiBurrowsTool = createSimpleTool({
  id: "geology/gas-viscosity-carr-kobayashi-burrows",
  title: "Gas Viscosity Carr Kobayashi Burrows Calculator",
  description:
    "Compute hydrocarbon gas viscosity with the Carr-Kobayashi-Burrows corresponding-states correlation for sweet gases.",
  inputs: [
    {
      description: "Gas pressure.",
      id: "pressurePa",
      kind: "number",
      label: "Pressure",
      minimum: 0,
      unit: "Pa",
    },
    {
      description: "Gas temperature.",
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
      description: "Gas viscosity in pascal seconds.",
      id: "gasViscosityPaS",
      kind: "number",
      label: "Gas viscosity",
      unit: "Pa·s",
    },
  ],
  calculate: (input) =>
    calculateGasViscosityCarrKobayashiBurrows(
      input as unknown as GasViscosityCarrKobayashiBurrowsInput,
    ),
});

export const runGasViscosityCarrKobayashiBurrows =
  gasViscosityCarrKobayashiBurrowsTool.execute;
export default gasViscosityCarrKobayashiBurrowsTool;

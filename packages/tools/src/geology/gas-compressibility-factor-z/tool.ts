import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GasCompressibilityFactorZInput = {
  readonly pressurePa: number;
  readonly temperatureK: number;
  readonly gasGravity?: number;
};

export type GasCompressibilityFactorZOutput = {
  readonly zFactor: number;
};

const PA_PER_PSIA = 6894.757293168361;

/**
 * Sutton pseudo-critical properties plus the Dranchuk-Abou-Kassem
 * explicit-z iteration.
 */
export const calculateGasCompressibilityFactorZ = (
  input: GasCompressibilityFactorZInput,
): GasCompressibilityFactorZOutput => {
  const { pressurePa, temperatureK } = input;
  const gravity = input.gasGravity ?? 0.7;
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
  const pseudoCriticalRankine = 169.2 + 349.5 * gravity - 74.0 * gravity ** 2;
  const pseudoCriticalPsia = 756.8 - 131.07 * gravity - 3.6 * gravity ** 2;
  const reducedT = (temperatureK * 1.8) / pseudoCriticalRankine;
  const reducedP = pressurePa / PA_PER_PSIA / pseudoCriticalPsia;
  const a1 = 0.3265;
  const a2 = -1.07;
  const a3 = -0.5339;
  const a4 = 0.01569;
  const a5 = -0.05165;
  const a6 = 0.5475;
  const a7 = -0.7361;
  const a8 = 0.1844;
  const a9 = 0.1056;
  const a10 = 0.6134;
  const a11 = 0.721;
  const c1 =
    a1 +
    a2 / reducedT +
    a3 / reducedT ** 3 +
    a4 / reducedT ** 4 +
    a5 / reducedT ** 5;
  const c2 = a6 + a7 / reducedT + a8 / reducedT ** 2;
  const c3 = a9 * (a7 / reducedT + a8 / reducedT ** 2);
  let z = 1;
  for (let iteration = 0; iteration < 200; iteration += 1) {
    const density = (0.27 * reducedP) / (z * reducedT);
    const next =
      1 +
      c1 * density +
      c2 * density ** 2 -
      c3 * density ** 5 +
      a10 *
        (1 + a11 * density ** 2) *
        (density ** 2 / reducedT ** 3) *
        Math.exp(-a11 * density ** 2);
    if (!Number.isFinite(next))
      simpleError(
        "gasGravity",
        "No finite Z factor for these conditions.",
        "invalid_conditions",
      );
    if (Math.abs(next - z) < 1e-12) return { zFactor: next };
    z = next;
  }
  return { zFactor: z };
};

export const gasCompressibilityFactorZExample = {
  input: {
    pressurePa: 13_789_514,
    temperatureK: 377.59444444444443,
    gasGravity: 0.7,
  },
  output: { zFactor: 0.8953202983225907 },
} satisfies ToolExample<
  GasCompressibilityFactorZInput,
  GasCompressibilityFactorZOutput
>;

export const gasCompressibilityFactorZTool = createSimpleTool({
  id: "geology/gas-compressibility-factor-z",
  title: "Gas Compressibility Factor Z Calculator",
  description:
    "Compute the natural-gas compressibility factor with Sutton pseudo-critical properties and the Dranchuk-Abou-Kassem method.",
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
      description: "Specific gravity of the hydrocarbon gas (air = 1).",
      id: "gasGravity",
      kind: "number",
      label: "Gas gravity",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Compressibility factor Z at the given conditions.",
      id: "zFactor",
      kind: "number",
      label: "Z factor",
    },
  ],
  calculate: (input) =>
    calculateGasCompressibilityFactorZ(
      input as unknown as GasCompressibilityFactorZInput,
    ),
});

export const runGasCompressibilityFactorZ =
  gasCompressibilityFactorZTool.execute;
export default gasCompressibilityFactorZTool;

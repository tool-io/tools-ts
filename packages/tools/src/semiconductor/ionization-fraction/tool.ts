import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IonizationFractionInput = {
  readonly dopingPerCm3: number;
  readonly ionizationEnergyEv: number;
  readonly temperatureK: number;
};

export type IonizationFractionOutput = {
  readonly ionizedFraction: number;
};

const KB_EV_PER_K = 8.617333262e-5;
/** Effective conduction-band density of states at 300 K (silicon default). */
const NC_300K = 2.8e19;
/** Donor degeneracy factor. */
const DEGENERACY = 2;

/** Nc(T) scales as T^1.5 from its 300 K reference value. */
const effectiveDensityOfStates = (temperatureK: number): number =>
  NC_300K * (temperatureK / 300) ** 1.5;

export const ionizationFractionExample = {
  input: {
    dopingPerCm3: 1e16,
    ionizationEnergyEv: 0.045,
    temperatureK: 300,
  },
  output: { ionizedFraction: 0.9959605432830781 },
} satisfies ToolExample<IonizationFractionInput, IonizationFractionOutput>;

export const calculateIonizationFraction = (
  input: IonizationFractionInput,
): IonizationFractionOutput => {
  const { dopingPerCm3, ionizationEnergyEv, temperatureK } = input;
  for (const [field, value] of [
    ["dopingPerCm3", dopingPerCm3],
    ["ionizationEnergyEv", ionizationEnergyEv],
    ["temperatureK", temperatureK],
  ] as const)
    if (!Number.isFinite(value) || value <= 0)
      simpleError(field, `${field} must be finite and positive.`);
  // Charge-neutrality solution for the fraction of ionized donors:
  // f = 2 / (1 + sqrt(1 + (4 * g * Nd / Nc) * exp(Ei / kT)))
  const logArgument =
    Math.log(DEGENERACY) +
    Math.log(dopingPerCm3) -
    Math.log(effectiveDensityOfStates(temperatureK)) +
    ionizationEnergyEv / (KB_EV_PER_K * temperatureK);
  const ionizedFraction =
    logArgument > 700
      ? Math.exp(-logArgument / 2)
      : 2 / (1 + Math.sqrt(1 + 4 * Math.exp(logArgument)));
  if (!Number.isFinite(ionizedFraction) || ionizedFraction <= 0)
    simpleError(
      "ionizationEnergyEv",
      "The ionized fraction is outside the representable range.",
      "numeric_range",
    );
  return { ionizedFraction };
};

export const ionizationFractionTool = createSimpleTool({
  calculate: (input) =>
    calculateIonizationFraction({
      dopingPerCm3: input.dopingPerCm3 as number,
      ionizationEnergyEv: input.ionizationEnergyEv as number,
      temperatureK: input.temperatureK as number,
    }),
  description:
    "Compute the fraction of dopants thermally ionized at a given temperature using the charge-neutrality approximation.",
  id: "semiconductor/ionization-fraction",
  inputs: [
    {
      description: "Dopant concentration.",
      format: "density-per-cm3",
      id: "dopingPerCm3",
      kind: "number",
      label: "Doping",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
    {
      description: "Ionization energy of the dopant level.",
      format: "energy-ev",
      id: "ionizationEnergyEv",
      kind: "number",
      label: "Ionization energy",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
    {
      description: "Lattice temperature.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      minimum: Number.MIN_VALUE,
      unit: "K",
    },
  ],
  outputs: [
    {
      description: "Fraction of dopants ionized, between zero and one.",
      format: "probability",
      id: "ionizedFraction",
      kind: "number",
      label: "Ionized fraction",
      maximum: 1,
      minimum: Number.MIN_VALUE,
    },
  ],
  title: "Ionization Fraction Calculator",
});
export const runIonizationFraction = ionizationFractionTool.execute;
export default ionizationFractionTool;

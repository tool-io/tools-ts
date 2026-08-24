import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DopingFromResistivityInput = {
  readonly carrierType: "n" | "p";
  readonly resistivityOhmCm: number;
};

export type DopingFromResistivityOutput = {
  readonly dopingPerCm3: number;
};

const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const dopingFromResistivityExample = {
  input: { carrierType: "n", resistivityOhmCm: 0.5 },
  output: { dopingPerCm3: 10002717578398080 },
} satisfies ToolExample<
  DopingFromResistivityInput,
  DopingFromResistivityOutput
>;

/** Approximate mobility as a function of doping, cm²/V·s (Caughey–Thomas). */
const mobilityForDoping = {
  n: (doping: number): number => 92 + 1268 / (1 + (doping / 1.3e17) ** 0.91),
  p: (doping: number): number =>
    54.3 + 406.9 / (1 + (doping / 2.35e17) ** 0.88),
};

export const calculateDopingFromResistivity = (
  input: DopingFromResistivityInput,
): DopingFromResistivityOutput => {
  const carrierType = input.carrierType;
  const resistivityOhmCm = input.resistivityOhmCm;

  if (carrierType !== "n" && carrierType !== "p")
    simpleError(
      "carrierType",
      "Carrier type must be 'n' or 'p'.",
      "invalid_carrier_type",
    );
  if (!Number.isFinite(resistivityOhmCm) || resistivityOhmCm <= 0)
    simpleError(
      "resistivityOhmCm",
      "Resistivity must be a finite positive number greater than 0 Ω·cm.",
      "invalid_resistivity",
    );

  const mobility = mobilityForDoping[carrierType];
  let low = 1e12;
  let high = 1e21;
  const resistivityAtLow = 1 / (ELEMENTARY_CHARGE_C * mobility(low) * low);
  const resistivityAtHigh = 1 / (ELEMENTARY_CHARGE_C * mobility(high) * high);
  if (
    resistivityOhmCm > resistivityAtLow ||
    resistivityOhmCm < resistivityAtHigh
  )
    simpleError(
      "resistivityOhmCm",
      `Resistivity is outside the mobility model's 1e12 to 1e21 cm^-3 search range (${resistivityAtHigh} to ${resistivityAtLow} Ω·cm).`,
      "outside_model_range",
    );
  for (let iteration = 0; iteration < 200; iteration += 1) {
    const mid = Math.sqrt(low * high);
    if (!Number.isFinite(mid) || mid <= 0)
      simpleError(
        "resistivityOhmCm",
        "Bisection midpoint overflowed.",
        "numeric_overflow",
      );
    const mu = mobility(mid);
    if (!Number.isFinite(mu) || mu <= 0)
      simpleError(
        "resistivityOhmCm",
        "Mobility calculation overflowed.",
        "numeric_overflow",
      );
    const resistivity = 1 / (ELEMENTARY_CHARGE_C * mu * mid);
    if (!Number.isFinite(resistivity))
      simpleError(
        "resistivityOhmCm",
        "Resistivity calculation overflowed.",
        "numeric_overflow",
      );
    if (resistivity > resistivityOhmCm) low = mid;
    else high = mid;
  }
  const dopingPerCm3 = Math.sqrt(low * high);
  if (!Number.isFinite(dopingPerCm3) || dopingPerCm3 <= 0)
    simpleError(
      "resistivityOhmCm",
      "Doping could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );
  return { dopingPerCm3: dopingPerCm3 === 0 ? 0 : dopingPerCm3 };
};

export const dopingFromResistivityTool = createSimpleTool({
  calculate: (input) =>
    calculateDopingFromResistivity({
      carrierType: input.carrierType as "n" | "p",
      resistivityOhmCm: input.resistivityOhmCm as number,
    }),
  description:
    "Estimate the dopant concentration from a measured silicon resistivity via bisection on Caughey–Thomas electron or hole mobility models. Mobility models: μ_n = 92+1268/(1+(N/1.3e17)^0.91) and μ_p = 54.3+406.9/(1+(N/2.35e17)^0.88) in cm²/V·s, resistivity ρ = 1/(q·μ·N) [Ω·cm] with q=1.602176634e-19 C. Bisection searches N in [1e12, 1e21] cm⁻³ for 200 iterations (geometric mid). Inputs: carrierType 'n' or 'p', ρ>0 Ω·cm. Output: N>0 cm⁻³. Assumes 300 K, complete ionization, and low-field mobility.",
  id: "semiconductor/doping-concentration-from-resistivity",
  inputs: [
    {
      description: "Majority carrier type.",
      enum: ["n", "p"],
      id: "carrierType",
      kind: "string",
      label: "Carrier type",
    },
    {
      description:
        "Measured resistivity of the material. Must be greater than 0 Ω·cm.",
      format: "resistivity",
      id: "resistivityOhmCm",
      kind: "number",
      label: "Resistivity",
      minimum: Number.MIN_VALUE,
      unit: "Ω·cm",
    },
  ],
  outputs: [
    {
      description: "Estimated dopant concentration. Greater than 0 cm⁻³.",
      format: "density-per-cm3",
      id: "dopingPerCm3",
      kind: "number",
      label: "Doping",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
  ],
  title: "Doping Concentration From Resistivity Calculator",
});
export const runDopingFromResistivity = dopingFromResistivityTool.execute;
export default dopingFromResistivityTool;

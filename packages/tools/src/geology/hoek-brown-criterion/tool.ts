import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HoekBrownCriterionInput = {
  readonly sigmaCiMPa: number;
  readonly sigma3MPa: number;
  readonly miConstant: number;
  readonly gsi: number;
  readonly disturbanceD?: number;
};

export type HoekBrownCriterionOutput = {
  readonly sigma1MPa: number;
  readonly hoekBrownMb: number;
  readonly hoekBrownS: number;
  readonly hoekBrownA: number;
};

export const calculateHoekBrownCriterion = (
  input: HoekBrownCriterionInput,
): HoekBrownCriterionOutput => {
  const { sigmaCiMPa, sigma3MPa, miConstant, gsi } = input;
  const disturbanceD = input.disturbanceD ?? 0;
  if (!(sigmaCiMPa > 0))
    simpleError(
      "sigmaCiMPa",
      "Intact uniaxial compressive strength must be greater than zero.",
      "invalid_strength",
    );
  if (!(miConstant > 0))
    simpleError(
      "miConstant",
      "The intact constant mi must be greater than zero.",
      "invalid_parameter",
    );
  if (!(gsi >= 0 && gsi <= 100))
    simpleError("gsi", "GSI must be between 0 and 100.", "invalid_gsi");
  if (!(disturbanceD >= 0 && disturbanceD <= 1))
    simpleError(
      "disturbanceD",
      "Disturbance factor D must be between 0 and 1.",
      "invalid_disturbance",
    );
  if (!(sigma3MPa >= 0))
    simpleError(
      "sigma3MPa",
      "Minor principal stress must be non-negative (compression positive).",
      "invalid_stress",
    );
  const hoekBrownMb =
    miConstant * Math.exp((gsi - 100) / (28 - 14 * disturbanceD));
  const hoekBrownS = Math.exp((gsi - 100) / (9 - 3 * disturbanceD));
  const hoekBrownA = 0.5 + (Math.exp(-gsi / 15) - Math.exp(-20 / 15)) / 6;
  return {
    hoekBrownA,
    hoekBrownMb,
    hoekBrownS,
    sigma1MPa:
      sigma3MPa +
      sigmaCiMPa *
        ((hoekBrownMb * sigma3MPa) / sigmaCiMPa + hoekBrownS) ** hoekBrownA,
  };
};

export const hoekBrownCriterionExample = {
  input: {
    sigmaCiMPa: 50,
    sigma3MPa: 5,
    miConstant: 10,
    gsi: 75,
    disturbanceD: 0,
  },
  output: {
    sigma1MPa: 40.461466964383064,
    hoekBrownMb: 4.094841251523642,
    hoekBrownS: 0.06217652402211632,
    hoekBrownA: 0.45719013481389315,
  },
} satisfies ToolExample<HoekBrownCriterionInput, HoekBrownCriterionOutput>;

export const hoekBrownCriterionTool = createSimpleTool({
  id: "geology/hoek-brown-criterion",
  title: "Hoek Brown Criterion Calculator",
  description:
    "Generalized Hoek-Brown peak strength sigma_1 = sigma_3 + sigma_ci*(m_b*sigma_3/sigma_ci + s)^a with m_b, s and a from GSI and the disturbance factor D (Hoek et al., 2002).",
  inputs: [
    {
      description: "Intact uniaxial compressive strength in megapascals.",
      id: "sigmaCiMPa",
      kind: "number",
      label: "sigma_ci",
      unit: "MPa",
    },
    {
      description: "Confining (minor principal) stress in megapascals.",
      id: "sigma3MPa",
      kind: "number",
      label: "sigma_3",
      unit: "MPa",
    },
    {
      description: "Intact rock constant mi for the lithology.",
      id: "miConstant",
      kind: "number",
      label: "mi",
    },
    {
      description: "Geological Strength Index (0-100).",
      id: "gsi",
      kind: "number",
      label: "GSI",
    },
    {
      default: 0,
      description: "Blasting/excavation disturbance factor D (0-1).",
      id: "disturbanceD",
      kind: "number",
      label: "D",
    },
  ],
  outputs: [
    {
      description: "Major principal stress at failure in megapascals.",
      id: "sigma1MPa",
      kind: "number",
      label: "sigma_1",
      unit: "MPa",
    },
    {
      description: "Hoek-Brown m_b parameter.",
      id: "hoekBrownMb",
      kind: "number",
      label: "m_b",
    },
    {
      description: "Hoek-Brown s parameter.",
      id: "hoekBrownS",
      kind: "number",
      label: "s",
    },
    {
      description: "Hoek-Brown a exponent.",
      id: "hoekBrownA",
      kind: "number",
      label: "a",
    },
  ],
  calculate: (input) =>
    calculateHoekBrownCriterion(input as unknown as HoekBrownCriterionInput),
});

export const runHoekBrownCriterion = hoekBrownCriterionTool.execute;
export default hoekBrownCriterionTool;

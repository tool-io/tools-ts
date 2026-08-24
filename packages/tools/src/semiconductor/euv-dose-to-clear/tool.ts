import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const SQUARE_MICROMETERS_PER_SQUARE_CENTIMETER = 1e8;
const MILLIJOULES_PER_JOULE = 1000;

export type EuvDoseToClearInput = {
  readonly photonEnergyJoules: number;
  readonly photonsPerUm2: number;
};

export type EuvDoseToClearOutput = {
  readonly doseMJPerCm2: number;
};

export const euvDoseToClearExample = {
  input: { photonEnergyJoules: 1.4725e-17, photonsPerUm2: 100 },
  output: { doseMJPerCm2: 0.00014725000000000003 },
} satisfies ToolExample<EuvDoseToClearInput, EuvDoseToClearOutput>;

export const calculateEuvDoseToClear = (
  input: EuvDoseToClearInput,
): EuvDoseToClearOutput => {
  if (
    !Number.isFinite(input.photonEnergyJoules) ||
    input.photonEnergyJoules <= 0
  )
    simpleError(
      "photonEnergyJoules",
      "Photon energy must be a finite number greater than zero.",
      "invalid_photon_energy",
    );
  if (!Number.isFinite(input.photonsPerUm2) || input.photonsPerUm2 <= 0)
    simpleError(
      "photonsPerUm2",
      "Photon fluence must be a finite number greater than zero.",
      "invalid_photon_fluence",
    );

  const directResult =
    input.photonsPerUm2 *
    SQUARE_MICROMETERS_PER_SQUARE_CENTIMETER *
    input.photonEnergyJoules *
    MILLIJOULES_PER_JOULE;
  if (Number.isFinite(directResult) && directResult > 0)
    return { doseMJPerCm2: directResult };

  const doseMJPerCm2 = Math.exp(
    Math.log(input.photonsPerUm2) +
      Math.log(input.photonEnergyJoules) +
      Math.log(
        SQUARE_MICROMETERS_PER_SQUARE_CENTIMETER * MILLIJOULES_PER_JOULE,
      ),
  );
  if (!Number.isFinite(doseMJPerCm2))
    simpleError(
      "photonsPerUm2",
      "The converted dose is too large to represent.",
      "numeric_overflow",
    );
  if (doseMJPerCm2 === 0)
    simpleError(
      "photonsPerUm2",
      "The converted dose is too small to represent.",
      "numeric_underflow",
    );
  return { doseMJPerCm2 };
};

export const euvDoseToClearTool = createSimpleTool({
  calculate: (input) =>
    calculateEuvDoseToClear({
      photonEnergyJoules: input.photonEnergyJoules as number,
      photonsPerUm2: input.photonsPerUm2 as number,
    }),
  description:
    "Convert EUV photon fluence and energy per photon to incident energy dose in millijoules per square centimeter.",
  id: "semiconductor/euv-dose-to-clear",
  inputs: [
    {
      description:
        "Energy per EUV photon; 13.5 nm light carries about 1.4725e-17 J.",
      id: "photonEnergyJoules",
      kind: "number",
      label: "Photon energy",
      minimum: Number.MIN_VALUE,
      unit: "J",
    },
    {
      description:
        "Incident photon fluence per square micrometer. An expected or averaged fluence may be fractional.",
      id: "photonsPerUm2",
      kind: "number",
      label: "Photons per µm²",
      minimum: Number.MIN_VALUE,
      unit: "photons/um^2",
    },
  ],
  outputs: [
    {
      description:
        "Incident areal energy dose. It is a dose-to-clear only when the input fluence is the measured clearing fluence.",
      id: "doseMJPerCm2",
      kind: "number",
      label: "Incident dose",
      minimum: Number.MIN_VALUE,
      unit: "mJ/cm^2",
    },
  ],
  title: "EUV Photon Fluence to Dose Calculator",
});
export const runEuvDoseToClear = euvDoseToClearTool.execute;
export default euvDoseToClearTool;

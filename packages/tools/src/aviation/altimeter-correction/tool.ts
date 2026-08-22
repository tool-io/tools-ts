import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AltimeterCorrectionInput = {
  /** Standard (ISA) temperature at this altitude. */
  readonly isaTemperatureC: number;
  readonly indicatedAltitudeFt: number;
  readonly oatC: number;
};

export type AltimeterCorrectionOutput = {
  readonly correctionFt: number;
  readonly correctedAltitudeFt: number;
};

/** Cold-weather rule: four feet per degree C below ISA per 1000 ft. */
const FT_PER_DEG_PER_THOUSAND = 4;

export const altimeterCorrectionExample = {
  input: {
    indicatedAltitudeFt: 5000,
    isaTemperatureC: 15,
    oatC: -25,
  },
  output: {
    correctedAltitudeFt: 5800,
    correctionFt: 800,
  },
} satisfies ToolExample<AltimeterCorrectionInput, AltimeterCorrectionOutput>;

export const calculateAltimeterCorrection = (
  input: AltimeterCorrectionInput,
): AltimeterCorrectionOutput => {
  const deviation = input.oatC - input.isaTemperatureC;
  const thousands = input.indicatedAltitudeFt / 1000;
  const correction = FT_PER_DEG_PER_THOUSAND * -deviation * thousands;
  return {
    correctedAltitudeFt: input.indicatedAltitudeFt + correction,
    // Adding zero normalizes IEEE negative zero into positive zero.
    correctionFt: correction + 0,
  };
};

export const altimeterCorrectionTool = createSimpleTool({
  calculate: (input) =>
    calculateAltimeterCorrection(input as unknown as AltimeterCorrectionInput),
  description:
    "Compute the cold-weather altimeter correction so the altimeter reads true altitude in colder-than-standard air.",
  id: "aviation/altimeter-correction",
  inputs: [
    {
      description: "Indicated altitude above the station or datum.",
      id: "indicatedAltitudeFt",
      kind: "number",
      label: "Indicated altitude",
      unit: "ft",
    },
    {
      description: "ISA standard temperature at this altitude.",
      id: "isaTemperatureC",
      kind: "number",
      label: "ISA temperature",
      unit: "°C",
    },
    {
      description: "Actual outside air temperature.",
      id: "oatC",
      kind: "number",
      label: "OAT",
      unit: "°C",
    },
  ],
  outputs: [
    {
      description: "Altitude to set on the altimeter after correction.",
      format: "length-ft",
      id: "correctedAltitudeFt",
      kind: "number",
      label: "Corrected altitude",
      unit: "ft",
    },
    {
      description: "Signed altitude correction applied; positive when cold.",
      format: "length-ft",
      id: "correctionFt",
      kind: "number",
      label: "Correction",
      unit: "ft",
    },
  ],
  title: "Altimeter Correction Calculator",
});
export const runAltimeterCorrection = altimeterCorrectionTool.execute;
export default altimeterCorrectionTool;

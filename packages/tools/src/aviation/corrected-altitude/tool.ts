import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CorrectedAltitudeInput = {
  readonly isaTemperatureC: number;
  readonly oatC: number;
  readonly trueAltitudeFt: number;
};

export type CorrectedAltitudeOutput = {
  /** What the altimeter would indicate uncorrected at these conditions. */
  readonly indicatedAltitudeFt: number;
  readonly correctionFt: number;
};

const FT_PER_DEG_PER_THOUSAND = 4;

export const correctedAltitudeExample = {
  input: { isaTemperatureC: 15, oatC: -25, trueAltitudeFt: 5000 },
  output: { indicatedAltitudeFt: 5800, correctionFt: 800 },
} satisfies ToolExample<CorrectedAltitudeInput, CorrectedAltitudeOutput>;

export const calculateCorrectedAltitude = (
  input: CorrectedAltitudeInput,
): CorrectedAltitudeOutput => {
  const deviation = input.oatC - input.isaTemperatureC;
  // Cold air makes the altimeter over-read: indicated exceeds true.
  const correction =
    FT_PER_DEG_PER_THOUSAND * -deviation * (input.trueAltitudeFt / 1000);
  return {
    correctionFt: correction === 0 ? 0 : correction,
    indicatedAltitudeFt:
      Math.round((input.trueAltitudeFt + correction) * 100) / 100,
  };
};

export const correctedAltitudeTool = createSimpleTool({
  calculate: (input) =>
    calculateCorrectedAltitude(input as unknown as CorrectedAltitudeInput),
  description:
    "Compute what an altimeter would indicate for a known true altitude under non-standard temperature — the inverse of the cold-weather altitude correction.",
  id: "aviation/corrected-altitude",
  inputs: [
    {
      description: "Actual height above the datum.",
      id: "trueAltitudeFt",
      kind: "number",
      label: "True altitude",
      unit: "ft",
    },
    {
      description: "ISA standard temperature at this level.",
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
      description: "Uncorrected altimeter indication for these conditions.",
      format: "length-ft",
      id: "indicatedAltitudeFt",
      kind: "number",
      label: "Indicated altitude",
      unit: "ft",
    },
    {
      description:
        "Signed temperature correction; positive when colder than ISA.",
      format: "length-ft",
      id: "correctionFt",
      kind: "number",
      label: "Correction",
      unit: "ft",
    },
  ],
  title: "Corrected Altitude Calculator",
});
export const runCorrectedAltitude = correctedAltitudeTool.execute;
export default correctedAltitudeTool;

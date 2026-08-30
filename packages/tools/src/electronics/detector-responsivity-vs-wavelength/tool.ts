import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DetectorResponsivityVsWavelengthInput = Readonly<{
  readonly quantumEfficiencyFraction: number;
  readonly wavelengthNanometers: number;
}>;
export type DetectorResponsivityVsWavelengthOutput = Readonly<{
  readonly responsivityAmperesPerWatt: number;
}>;

export const calculateDetectorResponsivityVsWavelength = (
  x: DetectorResponsivityVsWavelengthInput,
): DetectorResponsivityVsWavelengthOutput => {
  if (
    !Number.isFinite(x.quantumEfficiencyFraction) ||
    x.quantumEfficiencyFraction < 0
  )
    simpleError(
      "quantumEfficiencyFraction",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.wavelengthNanometers) || x.wavelengthNanometers < 0)
    simpleError("wavelengthNanometers", "Provide a finite number at least 0.");
  if (x.quantumEfficiencyFraction > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const responsivityAmperesPerWatt =
    (x.quantumEfficiencyFraction *
      1.602176634e-19 *
      x.wavelengthNanometers *
      1e-9) /
    (6.62607015e-34 * 299792458);
  if (!Number.isFinite(responsivityAmperesPerWatt))
    simpleError(
      "responsivityAmperesPerWatt",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    responsivityAmperesPerWatt: Object.is(responsivityAmperesPerWatt, -0)
      ? 0
      : responsivityAmperesPerWatt,
  };
};

export const example = {
  input: { quantumEfficiencyFraction: 0.8, wavelengthNanometers: 1000 },
  output: { responsivityAmperesPerWatt: 0.645243514987937 },
} satisfies ToolExample<
  DetectorResponsivityVsWavelengthInput,
  DetectorResponsivityVsWavelengthOutput
>;

export const tool = createSimpleTool({
  id: "electronics/detector-responsivity-vs-wavelength",
  title: "Detector Responsivity Vs Wavelength",
  description:
    "Ideal photodetector responsivity from external quantum efficiency and incident wavelength.",
  inputs: [
    {
      id: "quantumEfficiencyFraction",
      kind: "number",
      label: "Quantum Efficiency Fraction",
      minimum: 0,
    },
    {
      id: "wavelengthNanometers",
      kind: "number",
      label: "Wavelength Nanometers",
      unit: "nm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "responsivityAmperesPerWatt",
      kind: "number",
      label: "Responsivity Amperes Per Watt",
      unit: "A/W",
    },
  ],
  calculate: (input) =>
    calculateDetectorResponsivityVsWavelength({
      quantumEfficiencyFraction: input.quantumEfficiencyFraction as number,
      wavelengthNanometers: input.wavelengthNanometers as number,
    }),
});
export const detectorResponsivityVsWavelengthTool = tool;
export const runDetectorResponsivityVsWavelength = tool.execute;
export default tool;

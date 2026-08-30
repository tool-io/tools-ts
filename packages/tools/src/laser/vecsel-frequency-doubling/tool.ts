import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fundamentalPowerWatts: number;
  readonly externalConversionEfficiencyPercent: number;
  readonly fundamentalWavelengthNanometers: number;
}>;
export type Output = Readonly<{
  readonly secondHarmonicPowerWatts: number;
  readonly secondHarmonicWavelengthNanometers: number;
  readonly residualFundamentalPowerWatts: number;
}>;

export const calculate = (input: Input): Output => {
  const secondHarmonicPowerWatts =
    (input.fundamentalPowerWatts * input.externalConversionEfficiencyPercent) /
    100;
  return {
    secondHarmonicPowerWatts,
    secondHarmonicWavelengthNanometers:
      input.fundamentalWavelengthNanometers / 2,
    residualFundamentalPowerWatts:
      input.fundamentalPowerWatts - secondHarmonicPowerWatts,
  };
};

export const exampleInput = {
  fundamentalPowerWatts: 10,
  externalConversionEfficiencyPercent: 40,
  fundamentalWavelengthNanometers: 1000,
} satisfies Input;
export const exampleOutput = {
  secondHarmonicPowerWatts: 4,
  secondHarmonicWavelengthNanometers: 500,
  residualFundamentalPowerWatts: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      fundamentalPowerWatts: input.fundamentalPowerWatts as number,
      externalConversionEfficiencyPercent:
        input.externalConversionEfficiencyPercent as number,
      fundamentalWavelengthNanometers:
        input.fundamentalWavelengthNanometers as number,
    }),
  description:
    "Calculate externally frequency-doubled VECSEL power, wavelength, and residual fundamental power.",
  id: "laser/vecsel-frequency-doubling",
  inputs: [
    {
      id: "fundamentalPowerWatts",
      label: "Fundamental power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "externalConversionEfficiencyPercent",
      label: "External doubling efficiency",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "fundamentalWavelengthNanometers",
      label: "Fundamental wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "secondHarmonicPowerWatts",
      label: "Second-harmonic power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "secondHarmonicWavelengthNanometers",
      label: "Second-harmonic wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "residualFundamentalPowerWatts",
      label: "Residual fundamental power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
  ],
  title: "VECSEL Frequency Doubling",
});

export const run = tool.execute;
export default tool;

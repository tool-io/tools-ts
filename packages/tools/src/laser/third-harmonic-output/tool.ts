import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fundamentalPowerWatts: number;
  readonly cubicConversionCoefficientPerW2: number;
}>;
export type Output = Readonly<{
  readonly undepletedThirdHarmonicWatts: number;
  readonly energyLimitedThirdHarmonicWatts: number;
}>;

export const calculate = (input: Input): Output => {
  const undepletedThirdHarmonicWatts =
    input.cubicConversionCoefficientPerW2 * input.fundamentalPowerWatts ** 3;
  return {
    undepletedThirdHarmonicWatts,
    energyLimitedThirdHarmonicWatts: Math.min(
      undepletedThirdHarmonicWatts,
      input.fundamentalPowerWatts,
    ),
  };
};

export const exampleInput = {
  fundamentalPowerWatts: 10,
  cubicConversionCoefficientPerW2: 0.001,
} satisfies Input;
export const exampleOutput = {
  undepletedThirdHarmonicWatts: 1,
  energyLimitedThirdHarmonicWatts: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      fundamentalPowerWatts: input.fundamentalPowerWatts as number,
      cubicConversionCoefficientPerW2:
        input.cubicConversionCoefficientPerW2 as number,
    }),
  description:
    "Estimate cubic third-harmonic output and cap it at input power.",
  id: "laser/third-harmonic-output",
  inputs: [
    {
      id: "fundamentalPowerWatts",
      label: "Fundamental power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "cubicConversionCoefficientPerW2",
      label: "Cubic conversion coefficient",
      kind: "number",
      minimum: 0,
      unit: "1/W²",
    },
  ],
  outputs: [
    {
      id: "undepletedThirdHarmonicWatts",
      label: "Undepleted third-harmonic estimate",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "energyLimitedThirdHarmonicWatts",
      label: "Energy-limited third-harmonic output",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
  ],
  title: "Third-Harmonic Output",
});

export const run = tool.execute;
export default tool;

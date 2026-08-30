import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly channelWavelengthsNanometers: readonly number[];
}>;
export type Output = Readonly<{
  readonly adjacentSpacingsNanometers: readonly number[];
  readonly meanSpacingNanometers: number;
  readonly maximumSpacingDeviationNanometers: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.channelWavelengthsNanometers.length < 2)
    simpleError(
      "channelWavelengthsNanometers",
      "At least two channel wavelengths are required.",
      "insufficient_channels",
    );
  const sorted = [...input.channelWavelengthsNanometers].sort((a, b) => a - b);
  const adjacentSpacingsNanometers = sorted
    .slice(1)
    .map((value, index) => value - sorted[index]);
  const meanSpacingNanometers =
    adjacentSpacingsNanometers.reduce((a, b) => a + b, 0) /
    adjacentSpacingsNanometers.length;
  return {
    adjacentSpacingsNanometers,
    meanSpacingNanometers,
    maximumSpacingDeviationNanometers: Math.max(
      ...adjacentSpacingsNanometers.map((value) =>
        Math.abs(value - meanSpacingNanometers),
      ),
    ),
  };
};

export const exampleInput = {
  channelWavelengthsNanometers: [1549, 1550, 1551.2],
} satisfies Input;
export const exampleOutput = {
  adjacentSpacingsNanometers: [1, 1.2000000000000455],
  meanSpacingNanometers: 1.1000000000000227,
  maximumSpacingDeviationNanometers: 0.10000000000002274,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      channelWavelengthsNanometers:
        input.channelWavelengthsNanometers as readonly number[],
    }),
  description:
    "Measure adjacent wavelength spacing and spacing nonuniformity in a DFB array.",
  id: "laser/dfb-array-channel-spacing",
  inputs: [
    {
      id: "channelWavelengthsNanometers",
      label: "Channel wavelengths",
      kind: "numberList",
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "adjacentSpacingsNanometers",
      label: "Adjacent spacings",
      kind: "numberList",
      unit: "nm",
    },
    {
      id: "meanSpacingNanometers",
      label: "Mean spacing",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "maximumSpacingDeviationNanometers",
      label: "Maximum spacing deviation",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  title: "DFB Array Channel Spacing",
});

export const run = tool.execute;
export default tool;

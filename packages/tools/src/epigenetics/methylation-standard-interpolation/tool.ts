import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lowerStandardSignal: number;
  readonly lowerStandardPercent: number;
  readonly upperStandardSignal: number;
  readonly upperStandardPercent: number;
  readonly sampleSignal: number;
}>;
export type Output = Readonly<{
  readonly interpolationFraction: number;
  readonly interpolatedMethylationPercent: number;
  readonly withinStandardRange: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.upperStandardSignal === input.lowerStandardSignal)
    simpleError(
      "upperStandardSignal",
      "Standard signals must differ.",
      "singular_standards",
    );
  const interpolationFraction =
      (input.sampleSignal - input.lowerStandardSignal) /
      (input.upperStandardSignal - input.lowerStandardSignal),
    interpolatedMethylationPercent =
      input.lowerStandardPercent +
      interpolationFraction *
        (input.upperStandardPercent - input.lowerStandardPercent);
  return {
    interpolationFraction,
    interpolatedMethylationPercent,
    withinStandardRange:
      interpolationFraction >= 0 && interpolationFraction <= 1,
  };
};

export const exampleInput = {
  lowerStandardSignal: 100,
  lowerStandardPercent: 0,
  upperStandardSignal: 300,
  upperStandardPercent: 100,
  sampleSignal: 200,
} satisfies Input;
export const exampleOutput = {
  interpolationFraction: 0.5,
  interpolatedMethylationPercent: 50,
  withinStandardRange: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      lowerStandardSignal: input.lowerStandardSignal as number,
      lowerStandardPercent: input.lowerStandardPercent as number,
      upperStandardSignal: input.upperStandardSignal as number,
      upperStandardPercent: input.upperStandardPercent as number,
      sampleSignal: input.sampleSignal as number,
    }),
  description:
    "Linearly interpolate methylation percentage from two assay standards.",
  id: "epigenetics/methylation-standard-interpolation",
  inputs: [
    {
      id: "lowerStandardSignal",
      label: "Lower standard signal",
      kind: "number",
    },
    {
      id: "lowerStandardPercent",
      label: "Lower standard methylation",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "upperStandardSignal",
      label: "Upper standard signal",
      kind: "number",
    },
    {
      id: "upperStandardPercent",
      label: "Upper standard methylation",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    { id: "sampleSignal", label: "Sample signal", kind: "number" },
  ],
  outputs: [
    {
      id: "interpolationFraction",
      label: "Interpolation fraction",
      kind: "number",
    },
    {
      id: "interpolatedMethylationPercent",
      label: "Interpolated methylation",
      kind: "number",
      unit: "%",
    },
    {
      id: "withinStandardRange",
      label: "Sample lies within standard range",
      kind: "boolean",
    },
  ],
  title: "Methylation Standard Interpolation",
});

export const run = tool.execute;
export default tool;

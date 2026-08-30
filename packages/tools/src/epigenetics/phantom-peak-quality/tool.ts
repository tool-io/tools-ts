import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fragmentPeakCorrelation: number;
  readonly phantomPeakCorrelation: number;
  readonly minimumRsc: number;
}>;
export type Output = Readonly<{
  readonly relativeStrandCorrelation: number;
  readonly phantomPeakRatio: number;
  readonly passesGate: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.phantomPeakCorrelation <= 0 || input.fragmentPeakCorrelation <= 0)
    simpleError(
      "phantomPeakCorrelation",
      "Peak correlations must be positive.",
      "invalid_peaks",
    );
  const relativeStrandCorrelation =
    input.fragmentPeakCorrelation / input.phantomPeakCorrelation;
  return {
    relativeStrandCorrelation,
    phantomPeakRatio:
      input.phantomPeakCorrelation / input.fragmentPeakCorrelation,
    passesGate: relativeStrandCorrelation >= input.minimumRsc,
  };
};

export const exampleInput = {
  fragmentPeakCorrelation: 0.2,
  phantomPeakCorrelation: 0.1,
  minimumRsc: 1.5,
} satisfies Input;
export const exampleOutput = {
  relativeStrandCorrelation: 2,
  phantomPeakRatio: 0.5,
  passesGate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      fragmentPeakCorrelation: input.fragmentPeakCorrelation as number,
      phantomPeakCorrelation: input.phantomPeakCorrelation as number,
      minimumRsc: input.minimumRsc as number,
    }),
  description: "Rate fragment versus phantom cross-correlation peaks.",
  id: "epigenetics/phantom-peak-quality",
  inputs: [
    {
      id: "fragmentPeakCorrelation",
      label: "Fragment peak correlation",
      kind: "number",
      minimum: 0,
    },
    {
      id: "phantomPeakCorrelation",
      label: "Phantom peak correlation",
      kind: "number",
      minimum: 0,
    },
    {
      id: "minimumRsc",
      label: "Minimum relative strand correlation",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "relativeStrandCorrelation",
      label: "Relative strand correlation",
      kind: "number",
      minimum: 0,
    },
    {
      id: "phantomPeakRatio",
      label: "Phantom-to-fragment peak ratio",
      kind: "number",
      minimum: 0,
    },
    { id: "passesGate", label: "Passes phantom-peak gate", kind: "boolean" },
  ],
  title: "Phantom-Peak Quality",
});

export const run = tool.execute;
export default tool;

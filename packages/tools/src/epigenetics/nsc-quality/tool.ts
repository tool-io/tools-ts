import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly maximumCrossCorrelation: number;
  readonly backgroundCrossCorrelation: number;
  readonly minimumNsc: number;
}>;
export type Output = Readonly<{
  readonly normalizedStrandCrossCorrelation: number;
  readonly passesGate: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.backgroundCrossCorrelation <= 0)
    simpleError(
      "backgroundCrossCorrelation",
      "Background correlation must be positive.",
      "zero_background",
    );
  const normalizedStrandCrossCorrelation =
    input.maximumCrossCorrelation / input.backgroundCrossCorrelation;
  return {
    normalizedStrandCrossCorrelation,
    passesGate: normalizedStrandCrossCorrelation >= input.minimumNsc,
  };
};

export const exampleInput = {
  maximumCrossCorrelation: 0.1,
  backgroundCrossCorrelation: 0.05,
  minimumNsc: 1.5,
} satisfies Input;
export const exampleOutput = {
  normalizedStrandCrossCorrelation: 2,
  passesGate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      maximumCrossCorrelation: input.maximumCrossCorrelation as number,
      backgroundCrossCorrelation: input.backgroundCrossCorrelation as number,
      minimumNsc: input.minimumNsc as number,
    }),
  description:
    "Calculate normalized strand cross-correlation and quality gate.",
  id: "epigenetics/nsc-quality",
  inputs: [
    {
      id: "maximumCrossCorrelation",
      label: "Maximum strand cross-correlation",
      kind: "number",
      minimum: 0,
    },
    {
      id: "backgroundCrossCorrelation",
      label: "Background cross-correlation",
      kind: "number",
      minimum: 0,
    },
    { id: "minimumNsc", label: "Minimum NSC", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "normalizedStrandCrossCorrelation",
      label: "Normalized strand cross-correlation",
      kind: "number",
      minimum: 0,
    },
    { id: "passesGate", label: "Passes NSC gate", kind: "boolean" },
  ],
  title: "NSC Quality",
});

export const run = tool.execute;
export default tool;

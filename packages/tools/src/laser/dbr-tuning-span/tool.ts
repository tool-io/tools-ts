import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sectionTuningContributionsGhz: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedTuningGhz: number;
  readonly maximumIndependentSpanGhz: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.sectionTuningContributionsGhz.length === 0)
    simpleError(
      "sectionTuningContributionsGhz",
      "At least one tuning contribution is required.",
      "empty_sections",
    );
  return {
    signedTuningGhz: input.sectionTuningContributionsGhz.reduce(
      (a, b) => a + b,
      0,
    ),
    maximumIndependentSpanGhz: input.sectionTuningContributionsGhz.reduce(
      (sum, value) => sum + Math.abs(value),
      0,
    ),
  };
};

export const exampleInput = {
  sectionTuningContributionsGhz: [10, -5, 15],
} satisfies Input;
export const exampleOutput = {
  signedTuningGhz: 20,
  maximumIndependentSpanGhz: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      sectionTuningContributionsGhz:
        input.sectionTuningContributionsGhz as readonly number[],
    }),
  description: "Combine measured tuning contributions from DBR laser sections.",
  id: "laser/dbr-tuning-span",
  inputs: [
    {
      id: "sectionTuningContributionsGhz",
      label: "Section tuning contributions",
      kind: "numberList",
      unit: "GHz",
    },
  ],
  outputs: [
    {
      id: "signedTuningGhz",
      label: "Signed tuning",
      kind: "number",
      unit: "GHz",
    },
    {
      id: "maximumIndependentSpanGhz",
      label: "Sum of independent spans",
      kind: "number",
      minimum: 0,
      unit: "GHz",
    },
  ],
  title: "DBR Tuning Span",
});

export const run = tool.execute;
export default tool;

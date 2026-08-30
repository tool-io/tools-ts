import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedMz: number;
  readonly theoreticalMz: number;
  readonly maximumAbsolutePpm: number;
}>;
export type Output = Readonly<{
  readonly errorPpm: number;
  readonly withinTolerance: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.observedMz <= 0 ||
    input.theoreticalMz <= 0 ||
    input.maximumAbsolutePpm < 0
  )
    simpleError(
      "theoreticalMz",
      "Positive m/z values and nonnegative tolerance required.",
    );
  const errorPpm =
    ((input.observedMz - input.theoreticalMz) / input.theoreticalMz) * 1e6;
  return {
    errorPpm,
    withinTolerance: Math.abs(errorPpm) <= input.maximumAbsolutePpm,
  };
};
export const exampleInput = {
  observedMz: 101,
  theoreticalMz: 100,
  maximumAbsolutePpm: 10000,
} satisfies Input;
export const exampleOutput = {
  errorPpm: 10000,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/mass-accuracy-ppm",
  title: "Mass Accuracy PPM",
  description:
    "Calculate signed mass error in ppm relative to theoretical m/z.",
  inputs: [
    { id: "observedMz", kind: "number", label: "Observed mz" },
    { id: "theoreticalMz", kind: "number", label: "Theoretical mz" },
    { id: "maximumAbsolutePpm", kind: "number", label: "Maximum absolute ppm" },
  ],
  outputs: [
    { id: "errorPpm", kind: "number", label: "Error ppm" },
    { id: "withinTolerance", kind: "boolean", label: "Within tolerance" },
  ],
  calculate: (value) =>
    calculate({
      observedMz: value.observedMz as number,
      theoreticalMz: value.theoreticalMz as number,
      maximumAbsolutePpm: value.maximumAbsolutePpm as number,
    }),
});
export const run = tool.execute;
export default tool;

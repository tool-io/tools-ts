import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly modelMinutes: number;
  readonly guidedMinutes: number;
  readonly independentMinutes: number;
  readonly minimumIndependentFraction: number;
}>;
export type Output = Readonly<{
  readonly totalMinutes: number;
  readonly independentFraction: number;
  readonly releaseReady: boolean;
}>;
export const calculate = (input: Input): Output => {
  const v = [input.modelMinutes, input.guidedMinutes, input.independentMinutes];
  if (
    v.some((x) => x < 0) ||
    input.minimumIndependentFraction < 0 ||
    input.minimumIndependentFraction > 1
  )
    simpleError(
      "modelMinutes",
      "Nonnegative phase durations and fractional threshold required.",
    );
  const totalMinutes = v.reduce((a, b) => a + b, 0);
  if (totalMinutes <= 0)
    simpleError("modelMinutes", "At least one instructional minute required.");
  const independentFraction = input.independentMinutes / totalMinutes;
  return {
    totalMinutes,
    independentFraction,
    releaseReady:
      input.modelMinutes > 0 &&
      input.guidedMinutes > 0 &&
      independentFraction >= input.minimumIndependentFraction,
  };
};
export const exampleInput = {
  modelMinutes: 5,
  guidedMinutes: 10,
  independentMinutes: 15,
  minimumIndependentFraction: 0.4,
} satisfies Input;
export const exampleOutput = {
  totalMinutes: 30,
  independentFraction: 0.5,
  releaseReady: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/gradual-release-phase-tracker",
  title: "Gradual Release Phase Tracker",
  description:
    "Track modeling, guided practice, and independent work in gradual release.",
  inputs: [
    { id: "modelMinutes", label: "Model minutes", kind: "number" },
    { id: "guidedMinutes", label: "Guided minutes", kind: "number" },
    { id: "independentMinutes", label: "Independent minutes", kind: "number" },
    {
      id: "minimumIndependentFraction",
      label: "Minimum independent fraction",
      kind: "number",
    },
  ],
  outputs: [
    { id: "totalMinutes", label: "Total minutes", kind: "number" },
    {
      id: "independentFraction",
      label: "Independent fraction",
      kind: "number",
    },
    { id: "releaseReady", label: "Release ready", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      modelMinutes: value.modelMinutes as number,
      guidedMinutes: value.guidedMinutes as number,
      independentMinutes: value.independentMinutes as number,
      minimumIndependentFraction: value.minimumIndependentFraction as number,
    }),
});
export const run = tool.execute;
export default tool;

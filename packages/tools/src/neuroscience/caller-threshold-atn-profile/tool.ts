import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";
export type Input = Readonly<{
  readonly biomarkerValues: readonly number[];
  readonly positiveThresholds: readonly number[];
  readonly positiveDirections: readonly number[];
}>;
export type Output = Readonly<{
  readonly positiveFlags: readonly number[];
  readonly profile: string;
}>;
const inputFields = [
  { id: "biomarkerValues", label: "Biomarker values", kind: "numberList" },
  {
    id: "positiveThresholds",
    label: "Positive thresholds",
    kind: "numberList",
  },
  {
    id: "positiveDirections",
    label: "Positive directions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.biomarkerValues.length !== 3 ||
    input.positiveThresholds.length !== 3 ||
    input.positiveDirections.length !== 3
  )
    simpleError(
      "biomarkerValues",
      "Exactly three A/T/N values, thresholds and positivity directions required.",
    );
  if (input.positiveDirections.some((v) => v !== 1 && v !== -1))
    simpleError(
      "positiveDirections",
      "Use +1 for high-positive and −1 for low-positive biomarkers.",
    );
  const positiveFlags = input.biomarkerValues.map((v, i) =>
    input.positiveDirections[i] * (v - input.positiveThresholds[i]) >= 0
      ? 1
      : 0,
  );
  return {
    positiveFlags,
    profile: positiveFlags
      .map((v, i) => ["A", "T", "N"][i] + (v ? "+" : "-"))
      .join(""),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  biomarkerValues: [5, 2, 3],
  positiveThresholds: [4, 4, 2],
  positiveDirections: [1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  positiveFlags: [1, 0, 1],
  profile: "A+T-N+",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/caller-threshold-atn-profile",
  title: "ATN Classification Tool",
  description:
    "Label supplied A/T/N biomarkers with caller assay thresholds and direction, inclusive at threshold; profiles are descriptive research categories, not a diagnosis or disease stage.",
  inputs: inputFields,
  outputs: [
    { id: "positiveFlags", label: "Positive flags", kind: "numberList" },
    { id: "profile", label: "Profile", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      biomarkerValues: value.biomarkerValues as readonly number[],
      positiveThresholds: value.positiveThresholds as readonly number[],
      positiveDirections: value.positiveDirections as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

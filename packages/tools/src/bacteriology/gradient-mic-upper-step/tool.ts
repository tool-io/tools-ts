import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, ordered } from "../shared.js";

export type Input = Readonly<{
  readonly intersectionConcentration: number;
  readonly reportableConcentrations: readonly number[];
}>;
export type Output = Readonly<{
  readonly reportedMic: number;
  readonly roundedUp: boolean;
  readonly leftCensored: boolean;
}>;
export const calculate = (input: Input): Output => {
  positive(input.intersectionConcentration, "intersectionConcentration");
  ordered(input.reportableConcentrations, "reportableConcentrations");
  input.reportableConcentrations.forEach((v) =>
    positive(v, "reportableConcentrations"),
  );
  const index = input.reportableConcentrations.findIndex(
    (v) => v >= input.intersectionConcentration,
  );
  if (index < 0)
    simpleError(
      "intersectionConcentration",
      "Intersection lies above the supplied reportable range; do not silently cap it.",
    );
  const reportedMic = input.reportableConcentrations[index];
  return {
    reportedMic,
    roundedUp: reportedMic > input.intersectionConcentration,
    leftCensored:
      input.intersectionConcentration < input.reportableConcentrations[0],
  };
};
export const exampleInput = {
  intersectionConcentration: 1.5,
  reportableConcentrations: [0.5, 1, 2, 4],
} satisfies Input;
export const exampleOutput = {
  reportedMic: 2,
  roundedUp: true,
  leftCensored: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/gradient-mic-upper-step",
  title: "Gradient MIC Upper Step",
  description:
    "Round a gradient-strip MIC intersection upward to a supplied reportable dilution series; no clinical breakpoint is embedded.",
  inputs: [
    {
      id: "intersectionConcentration",
      label: "Intersection concentration",
      kind: "number",
    },
    {
      id: "reportableConcentrations",
      label: "Reportable concentrations",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "reportedMic", label: "Reported mic", kind: "number" },
    { id: "roundedUp", label: "Rounded up", kind: "boolean" },
    { id: "leftCensored", label: "Left censored", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      intersectionConcentration: value.intersectionConcentration as number,
      reportableConcentrations:
        value.reportableConcentrations as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

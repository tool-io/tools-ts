import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly lifetimeAverageDoses: readonly number[];
  readonly oralSlopeFactor: number;
}>;
export type Output = Readonly<{
  readonly linearRiskEstimates: readonly number[];
  readonly outsideProbabilityRangeFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "lifetimeAverageDoses",
    label: "Lifetime average doses",
    kind: "numberList",
  },
  { id: "oralSlopeFactor", label: "Oral slope factor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.lifetimeAverageDoses.length)
    simpleError(
      "lifetimeAverageDoses",
      "Nonempty compatible lifetime doses required.",
    );
  input.lifetimeAverageDoses.forEach((v) =>
    nonnegative(v, "lifetimeAverageDoses"),
  );
  positive(input.oralSlopeFactor, "oralSlopeFactor");
  const linearRiskEstimates = input.lifetimeAverageDoses.map(
    (v) => v * input.oralSlopeFactor,
  );
  return {
    linearRiskEstimates,
    outsideProbabilityRangeFlags: linearRiskEstimates.map((v) =>
      v > 1 ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lifetimeAverageDoses: [0.001, 0.002],
  oralSlopeFactor: 0.5,
} satisfies Input;
export const exampleOutput = {
  linearRiskEstimates: [0.0005, 0.001],
  outsideProbabilityRangeFlags: [0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/linear-cancer-slope-risk-screen",
  title: "Cancer Slope Factor Risk",
  description:
    "Evaluate a supplied oral cancer slope factor over compatible lifetime-average doses; linear extrapolations above one are preserved and flagged, not treated as probabilities.",
  inputs: inputFields,
  outputs: [
    {
      id: "linearRiskEstimates",
      label: "Linear risk estimates",
      kind: "numberList",
    },
    {
      id: "outsideProbabilityRangeFlags",
      label: "Outside probability range flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      lifetimeAverageDoses: value.lifetimeAverageDoses as readonly number[],
      oralSlopeFactor: value.oralSlopeFactor as number,
    }),
});
export const run = tool.execute;
export default tool;

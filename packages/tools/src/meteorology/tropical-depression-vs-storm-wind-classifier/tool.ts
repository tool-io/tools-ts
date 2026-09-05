import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly independentAgencyAveragedMaximumWindKnots: number;
}>;
export type Output = Readonly<{ readonly namedWindStage: string }>;
const inputFields = [
  {
    id: "independentAgencyAveragedMaximumWindKnots",
    label: "Independent agency averaged maximum wind knots",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.independentAgencyAveragedMaximumWindKnots, "wind");
  const w = input.independentAgencyAveragedMaximumWindKnots;
  return {
    namedWindStage:
      w < 34
        ? "tropical depression"
        : w < 64
          ? "tropical storm"
          : "hurricane-force wind",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentAgencyAveragedMaximumWindKnots: 40,
} satisfies Input;
export const exampleOutput = {
  namedWindStage: "tropical storm",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/tropical-depression-vs-storm-wind-classifier",
  title: "Tropical Depression vs Storm Wind Classifier",
  description:
    "Named34/64knot tropical wind stage screen, caller independently verifies tropical cyclone identity and agency averaging period; hurricane-force wind not inferred hurricane identity. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "namedWindStage", label: "Named wind stage", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      independentAgencyAveragedMaximumWindKnots:
        value.independentAgencyAveragedMaximumWindKnots as number,
    }),
});
export const run = tool.execute;
export default tool;

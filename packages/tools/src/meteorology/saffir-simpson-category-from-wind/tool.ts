import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly independentOneMinuteMaximumWindKnots: number;
}>;
export type Output = Readonly<{ readonly saffirSimpsonWindCategory: number }>;
const inputFields = [
  {
    id: "independentOneMinuteMaximumWindKnots",
    label: "Independent one minute maximum wind knots",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.independentOneMinuteMaximumWindKnots, "wind");
  const w = input.independentOneMinuteMaximumWindKnots;
  return {
    saffirSimpsonWindCategory:
      w < 64 ? 0 : w < 83 ? 1 : w < 96 ? 2 : w < 113 ? 3 : w < 137 ? 4 : 5,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentOneMinuteMaximumWindKnots: 100,
} satisfies Input;
export const exampleOutput = { saffirSimpsonWindCategory: 3 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/saffir-simpson-category-from-wind",
  title: "Saffir Simpson Category From Wind Lookup",
  description:
    "Saffir–Simpson1-minute wind category thresholds64/83/96/113/137knots, below hurricane threshold0; no surge/rain/total hazard. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "saffirSimpsonWindCategory",
      label: "Saffir simpson wind category",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      independentOneMinuteMaximumWindKnots:
        value.independentOneMinuteMaximumWindKnots as number,
    }),
});
export const run = tool.execute;
export default tool;

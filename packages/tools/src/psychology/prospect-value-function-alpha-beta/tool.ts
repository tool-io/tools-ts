import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, fit } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualPositiveOutcomeMagnitudes: readonly number[];
  readonly actualIndependentlyElicitedPositiveValues: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPositiveOutcomeMagnitudes",
    label: "Actual positive outcome magnitudes",
    kind: "numberList",
  },
  {
    id: "actualIndependentlyElicitedPositiveValues",
    label: "Actual independently elicited positive values",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.actualPositiveOutcomeMagnitudes.forEach((v) =>
    positive(v, "magnitude"),
  );
  input.actualIndependentlyElicitedPositiveValues.forEach((v) =>
    positive(v, "elicitedvalue"),
  );
  const a = fit(
    input.actualPositiveOutcomeMagnitudes.map(Math.log),
    input.actualIndependentlyElicitedPositiveValues.map(Math.log),
  );
  return { fittedPowerExponent: a.slope, fittedLogScale: a.intercept };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPositiveOutcomeMagnitudes: [1, 2, 4],
    actualIndependentlyElicitedPositiveValues: [1, 2, 4],
  },
  output: { result: { fittedPowerExponent: 1, fittedLogScale: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/prospect-value-function-alpha-beta",
  title: "Prospect Value Function Alpha/Beta Estimator",
  description:
    "OLS log positive utility magnitudes versus log actual outcomes for ONE separately identified gain/loss branch, not infer both\u03b1/\u03b2from one branch or validate subjective utility model.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

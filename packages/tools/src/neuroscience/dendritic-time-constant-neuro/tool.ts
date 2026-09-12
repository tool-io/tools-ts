import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  fit,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualDendriticDecayTimesSeconds: readonly number[];
  readonly actualPositiveBaselineSubtractedDendriticResponses: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDendriticDecayTimesSeconds",
    label: "Actual dendritic decay times seconds",
    kind: "numberList",
  },
  {
    id: "actualPositiveBaselineSubtractedDendriticResponses",
    label: "Actual positive baseline subtracted dendritic responses",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.actualPositiveBaselineSubtractedDendriticResponses.forEach((v) =>
    positive(v, "response"),
  );
  const a = fit(
    input.actualDendriticDecayTimesSeconds,
    input.actualPositiveBaselineSubtractedDendriticResponses.map(Math.log),
  );
  if (a.slope >= 0) simpleError("slope", "Actualdecayingloglinearbranch.");
  return { fittedDendriticDecayTimeConstantSeconds: -1 / a.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDendriticDecayTimesSeconds: [0, 1, 2],
    actualPositiveBaselineSubtractedDendriticResponses: [
      1, 0.36787944117144233, 0.1353352832366127,
    ],
  },
  output: { result: { fittedDendriticDecayTimeConstantSeconds: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/dendritic-time-constant-neuro",
  title: "Dendritic Time Constant Calculator",
  description:
    "OLS log decay fitted dendritic tau from actual independently baseline-subtracted positive responses, single exponential branch. Not passive RC product or spatial cable fit; time stamps need distinct values and actual matched branch.",
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

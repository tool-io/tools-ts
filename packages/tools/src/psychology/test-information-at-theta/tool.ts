import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  fraction,
  sum,
  aligned,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualTwoPlCorrectProbabilities: readonly number[];
  readonly callerCalibratedDiscriminations: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTwoPlCorrectProbabilities",
    label: "Actual two pl correct probabilities",
    kind: "numberList",
  },
  {
    id: "callerCalibratedDiscriminations",
    label: "Caller calibrated disc rim in at ions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualTwoPlCorrectProbabilities.length)
    simpleError(
      "actualTwoPlCorrectProbabilities",
      "Actual nonempty observations.",
    );
  input.actualTwoPlCorrectProbabilities.forEach((v) =>
    fraction(v, "actualTwoPlCorrectProbabilities"),
  );
  if (!input.callerCalibratedDiscriminations.length)
    simpleError(
      "callerCalibratedDiscriminations",
      "Actual nonempty observations.",
    );
  input.callerCalibratedDiscriminations.forEach((v) =>
    positive(v, "callerCalibratedDiscriminations"),
  );
  aligned(
    input.actualTwoPlCorrectProbabilities,
    input.callerCalibratedDiscriminations,
    "items",
  );
  return {
    value: sum(
      input.actualTwoPlCorrectProbabilities.map(
        (v, i) => input.callerCalibratedDiscriminations[i] ** 2 * v * (1 - v),
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTwoPlCorrectProbabilities: [0.5, 0.5],
    callerCalibratedDiscriminations: [1, 2],
  },
  output: { result: { value: 1.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/test-information-at-theta",
  title: "Test Information At Theta Calculator",
  description:
    "Actual independently evaluated2PL test information\u03a3a\u00b2P(1\u2212P) at one independently stated\u03b8, D=1, no guessing/lapse. Local independence/calibration external. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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

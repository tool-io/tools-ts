import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  positive,
  nonnegative,
  hopSymmetry,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredInvolvedHopResults: readonly number[];
  readonly independentlyMatchedUninvolvedHopResults: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredInvolvedHopResults",
    label: "Independently measured involved hop results",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedUninvolvedHopResults",
    label: "Independently matched uninvolved hop results",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyMeasuredInvolvedHopResults,
    input.independentlyMatchedUninvolvedHopResults,
    "hops",
  );
  input.independentlyMeasuredInvolvedHopResults.forEach((v) =>
    nonnegative(v, "result"),
  );
  input.independentlyMatchedUninvolvedHopResults.forEach((v) =>
    positive(v, "reference"),
  );
  const r = input.independentlyMeasuredInvolvedHopResults.map(
    (v, i) =>
      hopSymmetry({
        involvedLimbResult: v,
        uninvolvedLimbResult: input.independentlyMatchedUninvolvedHopResults[i],
      }).limbSymmetryPercent,
  );
  return {
    observedHopLimbSymmetryPercents: r,
    atOrAboveNominalNinetyFlags: r.map((v) => (v >= 90 ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredInvolvedHopResults: [90, 80],
    independentlyMatchedUninvolvedHopResults: [100, 100],
  },
  output: {
    result: {
      observedHopLimbSymmetryPercents: [90, 80],
      atOrAboveNominalNinetyFlags: [1, 0],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/hop-test-limb-symmetry-index-90-percent-criterion",
  title: "Hop Test Limb Symmetry Index\u226590% Criterion",
  description:
    "Actual matched hop-battery results using existing limb-symmetry calculation; each result retains nominal\u226590criterion separately, not automatically clear return to sport or detect bilateral deficits. Distance/time direction and same task convention caller verified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

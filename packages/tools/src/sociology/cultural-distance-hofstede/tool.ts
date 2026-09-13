import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  mean,
  aligned,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualFirstAggregateDimensionScores: readonly number[];
  readonly actualSecondAggregateDimensionScores: readonly number[];
  readonly callerApplicableDimensionVariances: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFirstAggregateDimensionScores",
    label: "Actual first aggregate dimension scores",
    kind: "numberList",
  },
  {
    id: "actualSecondAggregateDimensionScores",
    label: "Actual second aggregate dimension scores",
    kind: "numberList",
  },
  {
    id: "callerApplicableDimensionVariances",
    label: "Caller applicable dimension variances",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualFirstAggregateDimensionScores.length)
    simpleError(
      "actualFirstAggregateDimensionScores",
      "Actual nonempty observations.",
    );
  if (!input.actualSecondAggregateDimensionScores.length)
    simpleError(
      "actualSecondAggregateDimensionScores",
      "Actual nonempty observations.",
    );
  if (!input.callerApplicableDimensionVariances.length)
    simpleError(
      "callerApplicableDimensionVariances",
      "Actual nonempty observations.",
    );
  input.callerApplicableDimensionVariances.forEach((v) =>
    positive(v, "callerApplicableDimensionVariances"),
  );
  aligned(
    input.actualFirstAggregateDimensionScores,
    input.actualSecondAggregateDimensionScores,
    "dimensions",
  );
  aligned(
    input.actualFirstAggregateDimensionScores,
    input.callerApplicableDimensionVariances,
    "variance",
  );
  return {
    value: mean(
      input.actualFirstAggregateDimensionScores.map(
        (v, i) =>
          (v - input.actualSecondAggregateDimensionScores[i]) ** 2 /
          input.callerApplicableDimensionVariances[i],
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
    actualFirstAggregateDimensionScores: [1, 2],
    actualSecondAggregateDimensionScores: [0, 1],
    callerApplicableDimensionVariances: [1, 1],
  },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/cultural-distance-hofstede",
  title: "Hofstede Cultural Distance Calculator",
  description:
    "Declared Kogut\u2013Sing hag greg ate cultural distance mean squared score contrast/independent reference variance, matched country/instrument edition. Not universalHofstedeindexor individual cultural identity.",
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

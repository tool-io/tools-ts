import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  fraction,
  mean,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualCrossConstructAbsoluteCorrelations: readonly number[];
  readonly actualFirstWithinConstructAbsoluteCorrelations: readonly number[];
  readonly actualSecondWithinConstructAbsoluteCorrelations: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCrossConstructAbsoluteCorrelations",
    label: "Actual cross construct absolute correlations",
    kind: "numberList",
  },
  {
    id: "actualFirstWithinConstructAbsoluteCorrelations",
    label: "Actual first within construct absolute correlations",
    kind: "numberList",
  },
  {
    id: "actualSecondWithinConstructAbsoluteCorrelations",
    label: "Actual second within construct absolute correlations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualCrossConstructAbsoluteCorrelations.length)
    simpleError(
      "actualCrossConstructAbsoluteCorrelations",
      "Actual nonempty observations.",
    );
  input.actualCrossConstructAbsoluteCorrelations.forEach((v) =>
    fraction(v, "actualCrossConstructAbsoluteCorrelations"),
  );
  if (!input.actualFirstWithinConstructAbsoluteCorrelations.length)
    simpleError(
      "actualFirstWithinConstructAbsoluteCorrelations",
      "Actual nonempty observations.",
    );
  input.actualFirstWithinConstructAbsoluteCorrelations.forEach((v) =>
    fraction(v, "actualFirstWithinConstructAbsoluteCorrelations"),
  );
  if (!input.actualSecondWithinConstructAbsoluteCorrelations.length)
    simpleError(
      "actualSecondWithinConstructAbsoluteCorrelations",
      "Actual nonempty observations.",
    );
  input.actualSecondWithinConstructAbsoluteCorrelations.forEach((v) =>
    fraction(v, "actualSecondWithinConstructAbsoluteCorrelations"),
  );
  positive(
    mean(input.actualFirstWithinConstructAbsoluteCorrelations),
    "firstwithin",
  );
  positive(
    mean(input.actualSecondWithinConstructAbsoluteCorrelations),
    "secondwithin",
  );
  return {
    value:
      mean(input.actualCrossConstructAbsoluteCorrelations) /
      Math.sqrt(
        mean(input.actualFirstWithinConstructAbsoluteCorrelations) *
          mean(input.actualSecondWithinConstructAbsoluteCorrelations),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCrossConstructAbsoluteCorrelations: [0.4, 0.6],
    actualFirstWithinConstructAbsoluteCorrelations: [0.25, 0.25],
    actualSecondWithinConstructAbsoluteCorrelations: [0.25, 0.25],
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/htmt-discriminant-validity-ratio",
  title: "HTMT Discriminant Validity Ratio",
  description:
    "Observed HTMT mean absoluteheterotrait correlations/geometric mean within trait absolute correlations, actual matched distinct pairs/exclude diagonals; no bootstrap interval or automatic discriminant validity. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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

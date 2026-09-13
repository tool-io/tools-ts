import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  sum,
  aligned,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualOffDiagonalCorrelationSquares: readonly number[];
  readonly actualOffDiagonalPartialCorrelationSquares: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOffDiagonalCorrelationSquares",
    label: "Actual off diagonal correlation squares",
    kind: "numberList",
  },
  {
    id: "actualOffDiagonalPartialCorrelationSquares",
    label: "Actual off diagonal partial correlation squares",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualOffDiagonalCorrelationSquares.length)
    simpleError(
      "actualOffDiagonalCorrelationSquares",
      "Actual nonempty observations.",
    );
  input.actualOffDiagonalCorrelationSquares.forEach((v) =>
    nonnegative(v, "actualOffDiagonalCorrelationSquares"),
  );
  if (!input.actualOffDiagonalPartialCorrelationSquares.length)
    simpleError(
      "actualOffDiagonalPartialCorrelationSquares",
      "Actual nonempty observations.",
    );
  input.actualOffDiagonalPartialCorrelationSquares.forEach((v) =>
    nonnegative(v, "actualOffDiagonalPartialCorrelationSquares"),
  );
  aligned(
    input.actualOffDiagonalCorrelationSquares,
    input.actualOffDiagonalPartialCorrelationSquares,
    "pairs",
  );
  positive(
    sum(input.actualOffDiagonalCorrelationSquares) +
      sum(input.actualOffDiagonalPartialCorrelationSquares),
    "energy",
  );
  return {
    value:
      sum(input.actualOffDiagonalCorrelationSquares) /
      (sum(input.actualOffDiagonalCorrelationSquares) +
        sum(input.actualOffDiagonalPartialCorrelationSquares)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualOffDiagonalCorrelationSquares: [0.4, 0.4],
    actualOffDiagonalPartialCorrelationSquares: [0.1, 0.1],
  },
  output: { result: { value: 0.8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/kmo-sampling-adequacy",
  title: "KMO Sampling Adequacy Calculator",
  description:
    "KMO observed matched unordered off diagonal correlation squares versus partial correlation squares. Matrices/partial correlation estimation independently performed; not infer sample adequacy solely by universal cutoff. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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

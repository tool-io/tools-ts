import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, sum } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualFirstGroupObservations: readonly number[];
  readonly actualSecondGroupObservations: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFirstGroupObservations",
    label: "Actual first group observations",
    kind: "numberList",
  },
  {
    id: "actualSecondGroupObservations",
    label: "Actual second group observations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualFirstGroupObservations.length)
    simpleError(
      "actualFirstGroupObservations",
      "Actual nonempty observations.",
    );
  if (!input.actualSecondGroupObservations.length)
    simpleError(
      "actualSecondGroupObservations",
      "Actual nonempty observations.",
    );
  if (
    input.actualFirstGroupObservations.length *
      input.actualSecondGroupObservations.length >
    1000000
  )
    simpleError("pairs", "At most one million pairs.");
  return {
    value:
      sum(
        input.actualFirstGroupObservations.map((a) =>
          sum(
            input.actualSecondGroupObservations.map((b) =>
              a > b ? 1 : a < b ? -1 : 0,
            ),
          ),
        ),
      ) /
      (input.actualFirstGroupObservations.length *
        input.actualSecondGroupObservations.length),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFirstGroupObservations: [2, 3],
    actualSecondGroupObservations: [1, 3],
  },
  output: { result: { value: 0.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/nonoverlap-of-all-curves-cliff",
  title: "Cliff Delta Nonoverlap Calculator",
  description:
    "Cliff\u03b4pairwise wins minus losses overNpairs, ties zero, higher first direction. Distinct from proportion-only common language effect or all-curves temporal nonoverlap. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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

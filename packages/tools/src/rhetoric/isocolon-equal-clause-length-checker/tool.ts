import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyMeasuredClauseLengths: readonly number[];
  readonly callerPermittedSpread: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredClauseLengths",
    label: "Independently measured clause lengths",
    kind: "numberList",
  },
  {
    id: "callerPermittedSpread",
    label: "Caller permitted spread",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.independentlyMeasuredClauseLengths.length < 2)
    simpleError(
      "clauses",
      "At least two same-basis independently measured lengths.",
    );
  input.independentlyMeasuredClauseLengths.forEach((v) =>
    positive(v, "length"),
  );
  nonnegative(input.callerPermittedSpread, "spread");
  const s =
    Math.max(...input.independentlyMeasuredClauseLengths) -
    Math.min(...input.independentlyMeasuredClauseLengths);
  return {
    observedLengthSpread: s,
    withinCallerSpread: s <= input.callerPermittedSpread,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredClauseLengths: [5, 5, 6],
    callerPermittedSpread: 1,
  },
  output: { result: { observedLengthSpread: 1, withinCallerSpread: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/isocolon-equal-clause-length-checker",
  title: "Isocolon Equal Clause Length Checker",
  description:
    "Audit isocolon length equality under an explicit caller word/syllable/time basis and tolerance, not grammatical parallelism or literary efficacy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

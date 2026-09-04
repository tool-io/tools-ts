import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch44-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedNarrativeUnitIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedNarrativeUnitIds",
    label: "Independently annotated narrative unit ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.independentlyAnnotatedNarrativeUnitIds.length < 3 ||
    input.independentlyAnnotatedNarrativeUnitIds.some((v) => !v.trim())
  )
    simpleError(
      "units",
      "At least three independently established comparable narrative-unit IDs.",
    );
  return {
    triadStartIndices: input.independentlyAnnotatedNarrativeUnitIds.flatMap(
      (v, i) =>
        i + 2 < input.independentlyAnnotatedNarrativeUnitIds.length &&
        v === input.independentlyAnnotatedNarrativeUnitIds[i + 1] &&
        v === input.independentlyAnnotatedNarrativeUnitIds[i + 2]
          ? [i]
          : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAnnotatedNarrativeUnitIds: [
      "trial",
      "trial",
      "trial",
      "return",
    ],
  },
  output: { result: { triadStartIndices: [0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/rule-of-three-triad-repetition-checker",
  title: "Rule of Three Triad Repetition Checker",
  description:
    "Locate exact repeated three-unit windows in independently annotated narrative labels; overlapping windows retained, not infer Olriks law or author intent from words.",
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

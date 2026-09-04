import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch44-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedRhymeClassIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedRhymeClassIds",
    label: "Independently annotated rhyme class ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.independentlyAnnotatedRhymeClassIds.length !== 5 ||
    input.independentlyAnnotatedRhymeClassIds.some((v) => !v.trim())
  )
    simpleError(
      "rhyme",
      "Exactly five independently established phonological rhyme-class IDs.",
    );
  const [a, b, c, d, e] = input.independentlyAnnotatedRhymeClassIds;
  return { matchesAabba: a === b && a === e && c === d && a !== c };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyAnnotatedRhymeClassIds: ["A", "A", "B", "B", "A"] },
  output: { result: { matchesAabba: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/limerick-aabba-rhyme-scheme-validator",
  title: "Limerick Aabba Rhyme Scheme Validator",
  description:
    "Validate independently annotated five-line distinct-class AABBA pattern, not spelling rhymes, anapestic meter or limerick quality.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedSectionMotifIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedSectionMotifIds",
    label: "Independently annotated section motif ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.independentlyAnnotatedSectionMotifIds.length < 2 ||
    input.independentlyAnnotatedSectionMotifIds.some((v) => !v.trim())
  )
    simpleError(
      "sections",
      "At least two explicit independently established motif IDs.",
    );
  const pairs = Array.from(
    {
      length: Math.floor(
        input.independentlyAnnotatedSectionMotifIds.length / 2,
      ),
    },
    (_, i) => [i, input.independentlyAnnotatedSectionMotifIds.length - 1 - i],
  );
  return {
    matchedOuterPairIndices: pairs.filter(
      ([a, b]) =>
        input.independentlyAnnotatedSectionMotifIds[a] ===
        input.independentlyAnnotatedSectionMotifIds[b],
    ),
    unmatchedOuterPairIndices: pairs.filter(
      ([a, b]) =>
        input.independentlyAnnotatedSectionMotifIds[a] !==
        input.independentlyAnnotatedSectionMotifIds[b],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyAnnotatedSectionMotifIds: ["A", "B", "C", "B", "A"] },
  output: {
    result: {
      matchedOuterPairIndices: [
        [0, 4],
        [1, 3],
      ],
      unmatchedOuterPairIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/ring-composition-circular-return-checker",
  title: "Ring Composition Circular Return Checker",
  description:
    "Audit independently annotated nested ring-composition motif pairs, leaving odd center unpaired; no semantic similarity or author-intent determination.",
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

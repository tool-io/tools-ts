import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, itemTotals } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyCodedItemScores: readonly number[];
  readonly itemKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyCodedItemScores",
    label: "Independently coded item scores",
    kind: "numberList",
  },
  { id: "itemKnownFlags", label: "Item known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return itemTotals(
    input.independentlyCodedItemScores,
    input.itemKnownFlags,
    [3, 3],
    [0, 0],
    1,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyCodedItemScores: [1, 1], itemKnownFlags: [1, 1] },
  output: {
    result: {
      knownItemSum: 2,
      minimumPossibleTotal: 2,
      maximumPossibleTotal: 2,
      unknownItemIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/white-matter-lesion-fazekas",
  title: "Fazekas White Matter Lesion Calculator",
  description:
    "Fazekasperiventricular and deep-white-matter ordinal0\u20133ratings are independently assigned. Sum retained only as declared two-domain aggregation, not validated diagnostic total. Sum only independently assessed codes for the declared instrument/version; exact maxima [3, 3] and minima [0, 0]. Unknown items preserve possible total bounds without imputation. No questionnaire reproduction, clinical item assignment, norm, diagnosis, treatment or outcome prediction.",
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

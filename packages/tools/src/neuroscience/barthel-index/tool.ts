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
    [10, 5, 5, 10, 10, 10, 10, 15, 15, 10],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    5,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyCodedItemScores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    itemKnownFlags: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  output: {
    result: {
      knownItemSum: 50,
      minimumPossibleTotal: 50,
      maximumPossibleTotal: 50,
      unknownItemIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/barthel-index",
  title: "Barthel Index Calculator",
  description:
    "Original100-point Barthelten-item convention in feeding, bathing, grooming, dressing, bowels, bladder, toilet, transfer, mobility, stairs order. Sum only independently assessed codes for the declared instrument/version; exact maxima [10, 5, 5, 10, 10, 10, 10, 15, 15, 10] and minima [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]. Unknown items preserve possible total bounds without imputation. No questionnaire reproduction, clinical item assignment, norm, diagnosis, treatment or outcome prediction.",
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

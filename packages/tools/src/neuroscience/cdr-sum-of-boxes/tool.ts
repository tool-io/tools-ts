import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  itemTotals,
  simpleError,
} from "../batch47-shared.js";
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
  if (
    input.independentlyCodedItemScores.some(
      (v, i) => ![0, 0.5, 1, 2, 3].includes(v) || (i === 5 && v === 0.5),
    )
  )
    simpleError(
      "codes",
      "CDR boxes admit0,0.5,1,2,3; personal-care admits0,1,2,3 only.",
    );
  return itemTotals(
    input.independentlyCodedItemScores,
    input.itemKnownFlags,
    [3, 3, 3, 3, 3, 3],
    [0, 0, 0, 0, 0, 0],
    0.5,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyCodedItemScores: [0.5, 0.5, 0.5, 0.5, 0.5, 1],
    itemKnownFlags: [1, 1, 1, 1, 1, 1],
  },
  output: {
    result: {
      knownItemSum: 3.5,
      minimumPossibleTotal: 3.5,
      maximumPossibleTotal: 3.5,
      unknownItemIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/cdr-sum-of-boxes",
  title: "CDR Sum of Boxes Calculator",
  description:
    "CDRsum of six independently assessed box ratings, memory/orientation/judgment/community/home/personal care;0.5codes permitted in applicable boxes. Sum only independently assessed codes for the declared instrument/version; exact maxima [3, 3, 3, 3, 3, 3] and minima [0, 0, 0, 0, 0, 0]. Unknown items preserve possible total bounds without imputation. No questionnaire reproduction, clinical item assignment, norm, diagnosis, treatment or outcome prediction.",
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

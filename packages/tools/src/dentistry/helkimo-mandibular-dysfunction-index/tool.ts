import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  itemTotals,
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
  if (input.independentlyCodedItemScores.some((v) => ![0, 1, 5].includes(v)))
    simpleError(
      "codes",
      "Exact independently assigned Helkimo0/1/5domain codes.",
    );
  return itemTotals(
    input.independentlyCodedItemScores,
    input.itemKnownFlags,
    [5, 5, 5, 5, 5],
    [0, 0, 0, 0, 0],
    1,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyCodedItemScores: [1, 1, 1, 1, 1],
    itemKnownFlags: [1, 1, 1, 1, 1],
  },
  output: {
    result: {
      knownItemSum: 5,
      minimumPossibleTotal: 5,
      maximumPossibleTotal: 5,
      unknownItemIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/helkimo-mandibular-dysfunction-index",
  title: "Helkimo Dysfunction Index Calculator",
  description:
    "Helkimoclinical dysfunction five-domain0/1/5codes in range, movement, function, pain domains independently assessed; invalid2\u20134codes rejected. Sum only independently assessed codes for the declared instrument/version; exact maxima [5, 5, 5, 5, 5] and minima [0, 0, 0, 0, 0]. Unknown items preserve possible total bounds without imputation. No questionnaire reproduction, clinical item assignment, norm, diagnosis, treatment or outcome prediction.",
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

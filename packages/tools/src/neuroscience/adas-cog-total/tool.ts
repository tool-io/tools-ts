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
      (v, i) => i !== 0 && i !== 6 && !Number.isInteger(v),
    )
  )
    simpleError(
      "codes",
      "Only independently established word-recall/recognition means permit fractional scores; other ordinal items require whole codes.",
    );
  return itemTotals(
    input.independentlyCodedItemScores,
    input.itemKnownFlags,
    [10, 5, 5, 5, 5, 8, 12, 5, 5, 5, 5],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    0,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyCodedItemScores: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    itemKnownFlags: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  output: {
    result: {
      knownItemSum: 11,
      minimumPossibleTotal: 11,
      maximumPossibleTotal: 11,
      unknownItemIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/adas-cog-total",
  title: "ADAS-Cog Total Calculator",
  description:
    "ADAS-Cog-11 independently clinically coded items in the FDA-hosted ADAS administration/scoring manual order: word recall, commands, constructional praxis, naming, ideational praxis, orientation, word recognition, remembering recognition instructions, comprehension, word finding, spoken language. Maxima [10,5,5,5,5,8,12,5,5,5,5] sum to 70. Word recall/recognition may be independently established trial means; all other scores require whole codes. Unknown items preserve possible total bounds without imputation. No task reproduction, clinical item assignment, norm, diagnosis, treatment or outcome prediction. Reference: https://www.fda.gov/media/122843/download.",
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

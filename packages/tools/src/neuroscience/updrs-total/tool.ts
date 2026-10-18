import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, itemTotals } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyCodedItemScores: readonly number[];
  readonly itemKnownFlags: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyCodedItemScores",
    label: "Independently coded item scores",
    kind: "numberList",
  },
  { id: "itemKnownFlags", label: "Item known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return itemTotals(
    input.independentlyCodedItemScores,
    input.itemKnownFlags,
    [16, 52, 108, 23],
    [0, 0, 0, 0],
    1,
  );
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyCodedItemScores: [1, 1, 1, 1],
    itemKnownFlags: [1, 1, 1, 1],
  },
  output: {
    result: {
      knownItemSum: 4,
      minimumPossibleTotal: 4,
      maximumPossibleTotal: 4,
      unknownItemIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/updrs-total",
  title: "UPDRS Total Calculator",
  description:
    "Original UPDRSfour independently established part totals I\u2013IV, maximum199; not MDS-UPDRSor individual item assessment. Sum only independently assessed codes for the declared instrument/version; exact maxima [16, 52, 108, 23] and minima [0, 0, 0, 0]. Unknown items preserve possible total bounds without imputation. No questionnaire reproduction, clinical item assignment, norm, diagnosis, treatment or outcome prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          knownItemSum: { type: "number" },
          minimumPossibleTotal: { type: "number" },
          maximumPossibleTotal: { type: "number" },
          unknownItemIndices: { type: "array", items: { type: "number" } },
        },
        required: [
          "knownItemSum",
          "minimumPossibleTotal",
          "maximumPossibleTotal",
          "unknownItemIndices",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

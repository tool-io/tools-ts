import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  bounded,
  unique,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly sectionIds: readonly string[];
  readonly firstNumbers: readonly number[];
  readonly lastNumbers: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "sectionIds", label: "Section ids", kind: "stringList" },
  { id: "firstNumbers", label: "First numbers", kind: "numberList" },
  { id: "lastNumbers", label: "Last numbers", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  aligned(i.sectionIds, i.firstNumbers, "sections");
  aligned(i.sectionIds, i.lastNumbers, "sections");
  unique(i.sectionIds, "sections");
  i.firstNumbers.forEach((v, j) => {
    bounded(v, "first", 0, 1000000000);
    bounded(i.lastNumbers[j], "last", v, 1000000000);
  });
  const overlaps: number[][] = [];
  for (let a = 0; a < i.sectionIds.length; a++)
    for (let b = a + 1; b < i.sectionIds.length; b++)
      if (
        Math.max(i.firstNumbers[a], i.firstNumbers[b]) <=
        Math.min(i.lastNumbers[a], i.lastNumbers[b])
      )
        overlaps.push([a, b]);
  return {
    capacities: i.firstNumbers.map((v, j) => i.lastNumbers[j] - v + 1),
    overlappingSectionPairs: overlaps,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    sectionIds: ["assets", "liabilities"],
    firstNumbers: [1000, 2000],
    lastNumbers: [1999, 2999],
  },
  output: { result: { capacities: [1000, 1000], overlappingSectionPairs: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/chart-of-accounts-numbering-range-designer",
  title: "Chart Of Accounts Numbering Range Designer Tool",
  description:
    "Validate explicit inclusive account-number ranges and report capacities/collisions; no universal chart classifications.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          capacities: { type: "array", items: { type: "number" } },
          overlappingSectionPairs: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["capacities", "overlappingSectionPairs"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

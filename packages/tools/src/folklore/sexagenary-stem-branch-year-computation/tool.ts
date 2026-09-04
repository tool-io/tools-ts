import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, wrap } from "../batch44-shared.js";

export type Input = Readonly<{ readonly explicitChineseYearLabel: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "explicitChineseYearLabel",
    label: "Explicit chinese year label",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.explicitChineseYearLabel, "yearlabel", 1, 9999);
  const k = wrap(input.explicitChineseYearLabel - 1984, 60),
    stems = [
      "Jia",
      "Yi",
      "Bing",
      "Ding",
      "Wu",
      "Ji",
      "Geng",
      "Xin",
      "Ren",
      "Gui",
    ],
    branches = [
      "Zi",
      "Chou",
      "Yin",
      "Mao",
      "Chen",
      "Si",
      "Wu",
      "Wei",
      "Shen",
      "You",
      "Xu",
      "Hai",
    ],
    animals = [
      "Rat",
      "Ox",
      "Tiger",
      "Rabbit",
      "Dragon",
      "Snake",
      "Horse",
      "Goat",
      "Monkey",
      "Rooster",
      "Dog",
      "Pig",
    ];
  return {
    cycleOrdinal: k + 1,
    stem: stems[k % 10],
    branch: branches[k % 12],
    animal: animals[k % 12],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { explicitChineseYearLabel: 1984 },
  output: {
    result: { cycleOrdinal: 1, stem: "Jia", branch: "Zi", animal: "Rat" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/sexagenary-stem-branch-year-computation",
  title: "Sexagenary Stem Branch Year Computation",
  description:
    "Nominal Chinese sexagenary year-label arithmetic using 1984 Jia-Zi anchor. Caller supplies already established Chinese year label; no Gregorian-date conversion, lunar-new-year boundary or astrological prediction.",
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

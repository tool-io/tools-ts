import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualChineseLunarCycleYear: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualChineseLunarCycleYear",
    label: "Actual chinese lunar cycle year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(input.actualChineseLunarCycleYear, "lunarYear", 1, 9999);
  return {
    lunarCycleAnimal: [
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
    ][(((input.actualChineseLunarCycleYear - 2020) % 12) + 12) % 12],
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualChineseLunarCycleYear: 2020 },
  output: { result: { lunarCycleAnimal: "Rat" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/chinese-zodiac",
  title: "Chinese Zodiac Sign Lookup",
  description:
    "Chinese12yearanimalcyclefromactualindependently alreadyassignedLUNARcalendarYEAR,NOTGregorianbirthyearnearnewyear boundary;not personality. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

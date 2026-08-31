import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sonnerie } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly callerEnabledQuarterHourSlots: readonly number[];
}>;
export type Output = Readonly<{
  readonly hourStrikes: number;
  readonly quarterPairs: number;
  readonly totalHammerStrikes: number;
  readonly byQuarterSlot: readonly number[];
}>;
const inputFields = [
  {
    id: "callerEnabledQuarterHourSlots",
    label: "Caller enabled quarter hour slots",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return sonnerie(false, input.callerEnabledQuarterHourSlots);
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEnabledQuarterHourSlots: [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ],
} satisfies Input;
export const exampleOutput = {
  hourStrikes: 156,
  quarterPairs: 144,
  totalHammerStrikes: 444,
  byQuarterSlot: [
    12, 2, 4, 6, 1, 2, 4, 6, 2, 2, 4, 6, 3, 2, 4, 6, 4, 2, 4, 6, 5, 2, 4, 6, 6,
    2, 4, 6, 7, 2, 4, 6, 8, 2, 4, 6, 9, 2, 4, 6, 10, 2, 4, 6, 11, 2, 4, 6, 12,
    2, 4, 6, 1, 2, 4, 6, 2, 2, 4, 6, 3, 2, 4, 6, 4, 2, 4, 6, 5, 2, 4, 6, 6, 2,
    4, 6, 7, 2, 4, 6, 8, 2, 4, 6, 9, 2, 4, 6, 10, 2, 4, 6, 11, 2, 4, 6,
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/petite-sonnerie-strikes-per-day",
  title: "Petite Sonnerie Strikes Per Day Calculator",
  description:
    "Petite sonnerie actual caller enabled 96 quarter-hour slots: hours only on enabled exact-hour slots, paired quarter chimes on intermediate quarters. At exact hour no four-quarter repeat assumed; not a universal movement convention, DST day or audio rendering.",
  inputs: inputFields,
  outputs: [
    { id: "hourStrikes", label: "Hour strikes", kind: "number" },
    { id: "quarterPairs", label: "Quarter pairs", kind: "number" },
    { id: "totalHammerStrikes", label: "Total hammer strikes", kind: "number" },
    { id: "byQuarterSlot", label: "By quarter slot", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      callerEnabledQuarterHourSlots:
        value.callerEnabledQuarterHourSlots as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

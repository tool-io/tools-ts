import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly intervalEndHours: readonly number[];
  readonly eggsLaidPerInterval: readonly number[];
}>;
export type Output = Readonly<{
  readonly first24HoursEggCount: number;
  readonly totalObservedEggCount: number;
  readonly first24HoursOvipositionPercent: number;
}>;
const inputFields = [
  { id: "intervalEndHours", label: "Interval end hours", kind: "numberList" },
  {
    id: "eggsLaidPerInterval",
    label: "Eggs laid per interval",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.intervalEndHours.forEach((v) => positive(v, "intervalEndHours"));
  input.eggsLaidPerInterval.forEach((v) => count(v, "eggsLaidPerInterval"));
  aligned(
    input.intervalEndHours,
    input.eggsLaidPerInterval,
    "intervalEndHours",
  );
  ordered(input.intervalEndHours, "intervalEndHours");
  if (!input.intervalEndHours.includes(24))
    simpleError(
      "intervalEndHours",
      "An observed interval boundary at 24 hours is required; no within-bin egg allocation invented.",
    );
  const totalObservedEggCount = positive(
      input.eggsLaidPerInterval.reduce((a, b) => a + b, 0),
      "eggsLaidPerInterval",
    ),
    first24HoursEggCount = input.eggsLaidPerInterval.reduce(
      (s, v, i) => s + (input.intervalEndHours[i] <= 24 ? v : 0),
      0,
    );
  return {
    first24HoursEggCount,
    totalObservedEggCount,
    first24HoursOvipositionPercent:
      (100 * first24HoursEggCount) / totalObservedEggCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  intervalEndHours: [12, 24, 36],
  eggsLaidPerInterval: [100, 200, 100],
} satisfies Input;
export const exampleOutput = {
  first24HoursEggCount: 300,
  totalObservedEggCount: 400,
  first24HoursOvipositionPercent: 75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/oviposition-first-24h-percent",
  title: "Oviposition First 24H Percent",
  description:
    "Calculate observed first-24-hour oviposition share from nonoverlapping bins beginning at laying onset with an exact 24-hour boundary; later unobserved laying remains outside the denominator.",
  inputs: inputFields,
  outputs: [
    {
      id: "first24HoursEggCount",
      label: "First24 hours egg count",
      kind: "number",
    },
    {
      id: "totalObservedEggCount",
      label: "Total observed egg count",
      kind: "number",
    },
    {
      id: "first24HoursOvipositionPercent",
      label: "First24 hours oviposition percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      intervalEndHours: value.intervalEndHours as readonly number[],
      eggsLaidPerInterval: value.eggsLaidPerInterval as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

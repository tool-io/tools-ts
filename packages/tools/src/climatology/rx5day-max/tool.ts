import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, maximum } from "../shared.js";

export type Input = Readonly<{
  readonly dailyPrecipitationMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly rx5dayMm: number;
  readonly firstMaximumWindowStartIndex: number;
  readonly completeFiveDayWindowTotalsMm: readonly number[];
}>;
const inputFields = [
  {
    id: "dailyPrecipitationMm",
    label: "Daily precipitation mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.dailyPrecipitationMm.forEach((v) =>
    nonnegative(v, "dailyPrecipitationMm"),
  );
  if (input.dailyPrecipitationMm.length < 5)
    simpleError("days", "At least five gap-free days required.");
  const completeFiveDayWindowTotalsMm: number[] = [];
  // Constant five-element windows keep linear work bounded and do not carry
  // cancellation from a previous very large rain day into subsequent windows.
  for (let i = 0; i <= input.dailyPrecipitationMm.length - 5; i++) {
    completeFiveDayWindowTotalsMm.push(
      input.dailyPrecipitationMm.slice(i, i + 5).reduce((a, b) => a + b, 0),
    );
  }
  const rx5dayMm = maximum(completeFiveDayWindowTotalsMm);
  return {
    rx5dayMm,
    firstMaximumWindowStartIndex:
      completeFiveDayWindowTotalsMm.indexOf(rx5dayMm),
    completeFiveDayWindowTotalsMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyPrecipitationMm: [1, 2, 3, 4, 5, 0],
} satisfies Input;
export const exampleOutput = {
  rx5dayMm: 15,
  firstMaximumWindowStartIndex: 0,
  completeFiveDayWindowTotalsMm: [15, 14],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/rx5day-max",
  title: "Max 5-Day Precipitation RX5day Extractor",
  description:
    "Extract RX5day from all complete overlapping five-day windows in a gap-free sequence, permitting cross-month windows supplied by caller; not monthly totals or partial-window extrapolation.",
  inputs: inputFields,
  outputs: [
    { id: "rx5dayMm", label: "Rx5day mm", kind: "number" },
    {
      id: "firstMaximumWindowStartIndex",
      label: "First maximum window start index",
      kind: "number",
    },
    {
      id: "completeFiveDayWindowTotalsMm",
      label: "Complete five day window totals mm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyPrecipitationMm: value.dailyPrecipitationMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

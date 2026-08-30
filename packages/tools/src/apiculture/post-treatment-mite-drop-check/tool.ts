import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly beforeMiteDrops: readonly number[];
  readonly beforeExposureDays: readonly number[];
  readonly afterMiteDrops: readonly number[];
  readonly afterExposureDays: readonly number[];
  readonly backgroundMiteDropsPerDay: number;
}>;
export type Output = Readonly<{
  readonly beforeDropsPerDay: number;
  readonly afterDropsPerDay: number;
  readonly backgroundCorrectedDropReductionFraction: number;
}>;
const inputFields = [
  { id: "beforeMiteDrops", label: "Before mite drops", kind: "numberList" },
  {
    id: "beforeExposureDays",
    label: "Before exposure days",
    kind: "numberList",
  },
  { id: "afterMiteDrops", label: "After mite drops", kind: "numberList" },
  { id: "afterExposureDays", label: "After exposure days", kind: "numberList" },
  {
    id: "backgroundMiteDropsPerDay",
    label: "Background mite drops per day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.beforeExposureDays.forEach((v) => positive(v, "beforeExposureDays"));
  input.afterExposureDays.forEach((v) => positive(v, "afterExposureDays"));
  nonnegative(input.backgroundMiteDropsPerDay, "backgroundMiteDropsPerDay");
  input.beforeMiteDrops.forEach((v) => count(v, "beforeMiteDrops"));
  input.afterMiteDrops.forEach((v) => count(v, "afterMiteDrops"));
  aligned(input.beforeMiteDrops, input.beforeExposureDays, "beforeMiteDrops");
  aligned(input.afterMiteDrops, input.afterExposureDays, "afterMiteDrops");
  const beforeDropsPerDay =
      input.beforeMiteDrops.reduce((a, b) => a + b, 0) /
      input.beforeExposureDays.reduce((a, b) => a + b, 0),
    afterDropsPerDay =
      input.afterMiteDrops.reduce((a, b) => a + b, 0) /
      input.afterExposureDays.reduce((a, b) => a + b, 0),
    before = positive(
      beforeDropsPerDay - input.backgroundMiteDropsPerDay,
      "backgroundMiteDropsPerDay",
    );
  return {
    beforeDropsPerDay,
    afterDropsPerDay,
    backgroundCorrectedDropReductionFraction:
      1 - (afterDropsPerDay - input.backgroundMiteDropsPerDay) / before,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  beforeMiteDrops: [10, 20],
  beforeExposureDays: [1, 2],
  afterMiteDrops: [5, 10],
  afterExposureDays: [1, 2],
  backgroundMiteDropsPerDay: 2,
} satisfies Input;
export const exampleOutput = {
  beforeDropsPerDay: 10,
  afterDropsPerDay: 5,
  backgroundCorrectedDropReductionFraction: 0.625,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/post-treatment-mite-drop-check",
  title: "Post Treatment Mite Drop Check Tool",
  description:
    "Compare exposure-normalized mite-drop observations before/after an intervention with supplied background; this is a monitoring contrast, not causal treatment efficacy or evidence of colony mite clearance.",
  inputs: inputFields,
  outputs: [
    { id: "beforeDropsPerDay", label: "Before drops per day", kind: "number" },
    { id: "afterDropsPerDay", label: "After drops per day", kind: "number" },
    {
      id: "backgroundCorrectedDropReductionFraction",
      label: "Background corrected drop reduction fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      beforeMiteDrops: value.beforeMiteDrops as readonly number[],
      beforeExposureDays: value.beforeExposureDays as readonly number[],
      afterMiteDrops: value.afterMiteDrops as readonly number[],
      afterExposureDays: value.afterExposureDays as readonly number[],
      backgroundMiteDropsPerDay: value.backgroundMiteDropsPerDay as number,
    }),
});
export const run = tool.execute;
export default tool;

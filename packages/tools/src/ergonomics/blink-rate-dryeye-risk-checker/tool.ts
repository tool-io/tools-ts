import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
  sum,
  totalCount,
} from "../shared.js";
export type Input = Readonly<{
  readonly completeObservedBlinkCounts: readonly number[];
  readonly representedObservedMinutes: readonly number[];
  readonly callerMinimumCompleteBlinksPerMinute: number;
}>;
export type Output = Readonly<{
  readonly observedCompleteBlinkRatesPerMinute: readonly number[];
  readonly pooledObservedCompleteBlinksPerMinute: number;
  readonly belowCallerBlinkRateFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "completeObservedBlinkCounts",
    label: "Complete observed blink counts",
    kind: "numberList",
  },
  {
    id: "representedObservedMinutes",
    label: "Represented observed minutes",
    kind: "numberList",
  },
  {
    id: "callerMinimumCompleteBlinksPerMinute",
    label: "Caller minimum complete blinks per minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedObservedMinutes.forEach((v) =>
    positive(v, "representedObservedMinutes"),
  );
  nonnegative(
    input.callerMinimumCompleteBlinksPerMinute,
    "callerMinimumCompleteBlinksPerMinute",
  );
  input.completeObservedBlinkCounts.forEach((v) =>
    count(v, "completeObservedBlinkCounts"),
  );
  aligned(
    input.completeObservedBlinkCounts,
    input.representedObservedMinutes,
    "completeObservedBlinkCounts",
  );
  const r = input.completeObservedBlinkCounts.map(
    (v, i) => v / input.representedObservedMinutes[i],
  );
  return {
    observedCompleteBlinkRatesPerMinute: r,
    pooledObservedCompleteBlinksPerMinute:
      totalCount(input.completeObservedBlinkCounts, "blinks") /
      sum(input.representedObservedMinutes),
    belowCallerBlinkRateFlags: r.map((v) =>
      v < input.callerMinimumCompleteBlinksPerMinute ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  completeObservedBlinkCounts: [5, 10],
  representedObservedMinutes: [1, 2],
  callerMinimumCompleteBlinksPerMinute: 6,
} satisfies Input;
export const exampleOutput = {
  observedCompleteBlinkRatesPerMinute: [5, 5],
  pooledObservedCompleteBlinksPerMinute: 5,
  belowCallerBlinkRateFlags: [1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/blink-rate-dryeye-risk-checker",
  title: "Eye Blink Rate Dry-Eye Screen Time Risk Checker",
  description:
    "Audit counted complete blinks over actual observed time and caller comparison rate, not frame counts or unobserved screen hours; no dry-eye diagnosis, causation or therapy recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCompleteBlinkRatesPerMinute",
      label: "Observed complete blink rates per minute",
      kind: "numberList",
    },
    {
      id: "pooledObservedCompleteBlinksPerMinute",
      label: "Pooled observed complete blinks per minute",
      kind: "number",
    },
    {
      id: "belowCallerBlinkRateFlags",
      label: "Below caller blink rate flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      completeObservedBlinkCounts:
        value.completeObservedBlinkCounts as readonly number[],
      representedObservedMinutes:
        value.representedObservedMinutes as readonly number[],
      callerMinimumCompleteBlinksPerMinute:
        value.callerMinimumCompleteBlinksPerMinute as number,
    }),
});
export const run = tool.execute;
export default tool;

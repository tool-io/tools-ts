import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  aligned,
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedTrapBeetleCounts: readonly number[];
  readonly observedMatchedTrapDays: readonly number[];
  readonly callerBeetlesPerTrapDayThreshold: number;
}>;
export type Output = Readonly<{
  readonly pooledBeetlesPerTrapDay: number;
  readonly callerMonitoringThresholdReached: boolean;
}>;
const inputFields = [
  {
    id: "observedTrapBeetleCounts",
    label: "Observed trap beetle counts",
    kind: "numberList",
  },
  {
    id: "observedMatchedTrapDays",
    label: "Observed matched trap days",
    kind: "numberList",
  },
  {
    id: "callerBeetlesPerTrapDayThreshold",
    label: "Caller beetles per trap day threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedTrapDays.forEach((v) =>
    positive(v, "observedMatchedTrapDays"),
  );
  input.observedTrapBeetleCounts.forEach((v) =>
    nonnegative(v, "observedTrapBeetleCounts"),
  );
  nonnegative(
    input.callerBeetlesPerTrapDayThreshold,
    "callerBeetlesPerTrapDayThreshold",
  );
  aligned(
    input.observedTrapBeetleCounts,
    input.observedMatchedTrapDays,
    "observedTrapBeetleCounts",
  );
  input.observedTrapBeetleCounts.forEach((v) => integer(v, "beetles"));
  const r =
    sum(input.observedTrapBeetleCounts) / sum(input.observedMatchedTrapDays);
  return {
    pooledBeetlesPerTrapDay: r,
    callerMonitoringThresholdReached:
      r >= input.callerBeetlesPerTrapDayThreshold,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTrapBeetleCounts: [3, 5],
  observedMatchedTrapDays: [1, 2],
  callerBeetlesPerTrapDayThreshold: 3,
} satisfies Input;
export const exampleOutput = {
  pooledBeetlesPerTrapDay: 2.6666666666666665,
  callerMonitoringThresholdReached: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/small-hive-beetle-trap-threshold",
  title: "Small Hive Beetle Trap Threshold Checker",
  description:
    "Actual trap-exposure-normalized small hive beetle observations vs caller independently applicable monitoring threshold; no population extrapolation or control recommendation. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledBeetlesPerTrapDay",
      label: "Pooled beetles per trap day",
      kind: "number",
    },
    {
      id: "callerMonitoringThresholdReached",
      label: "Caller monitoring threshold reached",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTrapBeetleCounts:
        value.observedTrapBeetleCounts as readonly number[],
      observedMatchedTrapDays:
        value.observedMatchedTrapDays as readonly number[],
      callerBeetlesPerTrapDayThreshold:
        value.callerBeetlesPerTrapDayThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;

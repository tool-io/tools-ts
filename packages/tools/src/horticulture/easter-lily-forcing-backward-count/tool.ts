import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  aligned,
  dateMs,
  dateShift,
} from "../shared.js";
export type Input = Readonly<{
  readonly targetMarketDate: string;
  readonly stageDurationsDays: readonly number[];
  readonly stageBufferDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly stageStartDatesIso: string;
  readonly totalScheduledDays: number;
}>;
const inputFields = [
  { id: "targetMarketDate", label: "Target market date", kind: "string" },
  {
    id: "stageDurationsDays",
    label: "Stage durations days",
    kind: "numberList",
  },
  { id: "stageBufferDays", label: "Stage buffer days", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.stageDurationsDays.length > 128)
    simpleError("stages", "At most 128 forcing stages supported.");
  input.stageDurationsDays.forEach((v) => nonnegative(v, "stageDurationsDays"));
  input.stageBufferDays.forEach((v) => nonnegative(v, "stageBufferDays"));
  aligned(
    input.stageDurationsDays,
    input.stageBufferDays,
    "stageDurationsDays",
  );
  dateMs(input.targetMarketDate);
  let day = input.targetMarketDate,
    totalScheduledDays = 0;
  const dates: string[] = [];
  for (let i = input.stageDurationsDays.length - 1; i >= 0; i--) {
    const duration = count(
      Math.ceil(input.stageDurationsDays[i] + input.stageBufferDays[i]),
      "duration",
    );
    totalScheduledDays += duration;
    day = dateShift(day, -duration);
    dates.unshift(day);
  }
  return { stageStartDatesIso: dates.join(","), totalScheduledDays };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetMarketDate: "2026-04-05",
  stageDurationsDays: [10, 20, 30],
  stageBufferDays: [1, 2, 3],
} satisfies Input;
export const exampleOutput = {
  stageStartDatesIso: "2026-01-29,2026-02-09,2026-03-03",
  totalScheduledDays: 66,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/easter-lily-forcing-backward-count",
  title: "Easter Lily Forcing Backward Count",
  description:
    "Back-plan an Easter-lily forcing sequence from a supplied market date and stage durations/buffers, rounding each stage up to UTC days; no Easter computation or mutable cultivar forcing schedule.",
  inputs: inputFields,
  outputs: [
    {
      id: "stageStartDatesIso",
      label: "Stage start dates iso",
      kind: "string",
    },
    { id: "totalScheduledDays", label: "Total scheduled days", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      targetMarketDate: value.targetMarketDate as string,
      stageDurationsDays: value.stageDurationsDays as readonly number[],
      stageBufferDays: value.stageBufferDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

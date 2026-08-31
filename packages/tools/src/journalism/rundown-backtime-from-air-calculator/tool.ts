import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  instant,
  unique,
  sumMoney,
  bounded,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly hardOutUtc: string;
  readonly rundownItemIds: readonly string[];
  readonly itemDurationSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly backtimedItemStartUtc: readonly string[];
  readonly backtimedItemEndUtc: readonly string[];
  readonly totalScheduledSeconds: number;
}>;
const inputFields = [
  { id: "hardOutUtc", label: "Hard out utc", kind: "string" },
  { id: "rundownItemIds", label: "Rundown item ids", kind: "stringList" },
  {
    id: "itemDurationSeconds",
    label: "Item duration seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.rundownItemIds, input.itemDurationSeconds, "rundownItemIds");
  unique(input.rundownItemIds, "items");
  input.itemDurationSeconds.forEach((v) => bounded(v, "duration", 0, 86400));
  const hard = instant(input.hardOutUtc),
    total = sumMoney(input.itemDurationSeconds),
    starts: string[] = [],
    ends: string[] = [];
  let t = hard - total * 1000;
  const format = (t: number) => {
    const text = new Date(t).toISOString().replace(".000Z", "Z");
    instant(text);
    return text;
  };
  input.itemDurationSeconds.forEach((v) => {
    starts.push(format(t));
    t += v * 1000;
    ends.push(format(t));
  });
  return {
    backtimedItemStartUtc: starts,
    backtimedItemEndUtc: ends,
    totalScheduledSeconds: total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hardOutUtc: "2025-01-01T12:00:00Z",
  rundownItemIds: ["A", "B"],
  itemDurationSeconds: [30, 60],
} satisfies Input;
export const exampleOutput = {
  backtimedItemStartUtc: ["2025-01-01T11:58:30Z", "2025-01-01T11:59:00Z"],
  backtimedItemEndUtc: ["2025-01-01T11:59:00Z", "2025-01-01T12:00:00Z"],
  totalScheduledSeconds: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/rundown-backtime-from-air-calculator",
  title: "Rundown Backtime from Air Calculator",
  description:
    "Backtime actual ordered rundown durations from caller fixed UTC hard out, retaining per-item start/end across midnight; contiguous whole-second schedule, no inferred breaks, live variability or broad package-runtime duplicate.",
  inputs: inputFields,
  outputs: [
    {
      id: "backtimedItemStartUtc",
      label: "Backtimed item start utc",
      kind: "stringList",
    },
    {
      id: "backtimedItemEndUtc",
      label: "Backtimed item end utc",
      kind: "stringList",
    },
    {
      id: "totalScheduledSeconds",
      label: "Total scheduled seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      hardOutUtc: value.hardOutUtc as string,
      rundownItemIds: value.rundownItemIds as readonly string[],
      itemDurationSeconds: value.itemDurationSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

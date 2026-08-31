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
  nonnegative,
  bounded,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedProcessedPotCounts: readonly number[];
  readonly observedSessionMinutes: readonly number[];
  readonly observedDowntimeMinutes: readonly number[];
  readonly observedRejectedPotCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledGrossPotsPerActiveHour: number;
  readonly pooledSaleablePotsPerScheduledHour: number;
  readonly observedDowntimeShareOfScheduledTime: number;
}>;
const inputFields = [
  {
    id: "observedProcessedPotCounts",
    label: "Observed processed pot counts",
    kind: "numberList",
  },
  {
    id: "observedSessionMinutes",
    label: "Observed session minutes",
    kind: "numberList",
  },
  {
    id: "observedDowntimeMinutes",
    label: "Observed downtime minutes",
    kind: "numberList",
  },
  {
    id: "observedRejectedPotCounts",
    label: "Observed rejected pot counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSessionMinutes.forEach((v) =>
    positive(v, "observedSessionMinutes"),
  );
  input.observedDowntimeMinutes.forEach((v) =>
    nonnegative(v, "observedDowntimeMinutes"),
  );
  aligned(
    input.observedProcessedPotCounts,
    input.observedSessionMinutes,
    "observedProcessedPotCounts",
  );
  aligned(
    input.observedProcessedPotCounts,
    input.observedDowntimeMinutes,
    "observedProcessedPotCounts",
  );
  aligned(
    input.observedProcessedPotCounts,
    input.observedRejectedPotCounts,
    "observedProcessedPotCounts",
  );
  input.observedProcessedPotCounts.forEach((v) =>
    bounded(v, "pots", 0, 1000000),
  );
  input.observedRejectedPotCounts.forEach((v, i) =>
    bounded(v, "rejects", 0, input.observedProcessedPotCounts[i]),
  );
  if (
    input.observedDowntimeMinutes.some(
      (v, i) => v > input.observedSessionMinutes[i],
    )
  )
    simpleError("time", "Downtime exceeds session.");
  const session = sum(input.observedSessionMinutes),
    down = sum(input.observedDowntimeMinutes),
    active = session - down;
  positive(active, "activeTime");
  return {
    pooledGrossPotsPerActiveHour:
      (sum(input.observedProcessedPotCounts) * 60) / active,
    pooledSaleablePotsPerScheduledHour:
      ((sum(input.observedProcessedPotCounts) -
        sum(input.observedRejectedPotCounts)) *
        60) /
      session,
    observedDowntimeShareOfScheduledTime: down / session,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedProcessedPotCounts: [100, 200],
  observedSessionMinutes: [30, 60],
  observedDowntimeMinutes: [10, 10],
  observedRejectedPotCounts: [5, 10],
} satisfies Input;
export const exampleOutput = {
  pooledGrossPotsPerActiveHour: 257.14285714285717,
  pooledSaleablePotsPerScheduledHour: 190,
  observedDowntimeShareOfScheduledTime: 0.2222222222222222,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/potting-line-pots-hour",
  title: "Potting Line Pots Hour Calculator",
  description:
    "Calibrate actual potting-line gross active throughput separately from saleable scheduled throughput and downtime; unequal sessions pooled, not universal machine performance.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledGrossPotsPerActiveHour",
      label: "Pooled gross pots per active hour",
      kind: "number",
    },
    {
      id: "pooledSaleablePotsPerScheduledHour",
      label: "Pooled saleable pots per scheduled hour",
      kind: "number",
    },
    {
      id: "observedDowntimeShareOfScheduledTime",
      label: "Observed downtime share of scheduled time",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedProcessedPotCounts:
        value.observedProcessedPotCounts as readonly number[],
      observedSessionMinutes: value.observedSessionMinutes as readonly number[],
      observedDowntimeMinutes:
        value.observedDowntimeMinutes as readonly number[],
      observedRejectedPotCounts:
        value.observedRejectedPotCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

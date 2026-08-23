import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KaplanMeierInput = {
  readonly times: readonly number[];
  readonly events: readonly number[];
};

export type KaplanMeierOutput = {
  readonly finalSurvival: number;
  readonly stepCount: number;
  readonly survivalTable: (readonly number[])[];
};

export const calculateKaplanMeier = (
  input: KaplanMeierInput,
): KaplanMeierOutput => {
  if (input.times.length !== input.events.length)
    return simpleError(
      "events",
      "times and events must have the same length.",
      "mismatched_lengths",
    );
  if (input.times.length < 1)
    return simpleError(
      "times",
      "Provide at least one subject.",
      "insufficient_data",
    );
  if (input.times.some((time) => time < 0))
    return simpleError(
      "times",
      "Follow-up times must not be negative.",
      "invalid_time",
    );
  if (input.events.some((event) => event !== 0 && event !== 1))
    return simpleError(
      "events",
      "Event indicators must each be zero or one.",
      "invalid_event_indicator",
    );
  const order = input.times
    .map((time, index) => [time, index])
    .sort((left, right) => left[0]! - right[0]! || left[1]! - right[1]!);
  const table: number[][] = [];
  let survival = 1;
  let cursor = 0;
  while (cursor < order.length) {
    const time = order[cursor]![0]!;
    const atRisk = order.length - cursor;
    let deaths = 0;
    while (cursor < order.length && order[cursor]![0] === time) {
      if (input.events[order[cursor]![1]!] === 1) deaths += 1;
      cursor += 1;
    }
    if (deaths > 0) {
      survival *= 1 - deaths / atRisk;
      table.push([time, Number(survival.toPrecision(12)), atRisk, deaths]);
    }
  }
  return {
    finalSurvival: table.length > 0 ? table[table.length - 1]![1]! : 1,
    stepCount: table.length,
    survivalTable: table,
  };
};

export const kaplanMeierExample = {
  input: {
    times: [3, 5, 5, 6, 10],
    events: [1, 1, 0, 1, 1],
  },
  output: {
    finalSurvival: 0,
    stepCount: 4,
    survivalTable: [
      [3, 0.8, 5, 1],
      [5, 0.6, 4, 1],
      [6, 0.3, 2, 1],
      [10, 0, 1, 1],
    ],
  },
} satisfies ToolExample<KaplanMeierInput, KaplanMeierOutput>;

export const kaplanMeierTool = createSimpleTool({
  id: "statistics/kaplan-meier",
  title: "Kaplan-Meier Survival Estimator",
  description:
    "Estimate survival over time with the product-limit estimator from right-censored durations.",
  inputs: [
    {
      description: "Non-negative follow-up durations.",
      id: "times",
      kind: "numberList",
      label: "Times",
    },
    {
      description:
        "One means an event was observed, zero means right-censored; aligned with the times.",
      id: "events",
      kind: "numberList",
      label: "Event indicators",
    },
  ],
  outputs: [
    {
      description:
        "Survival probability after the last event time; one when nothing was observed to fail.",
      id: "finalSurvival",
      kind: "number",
      label: "Final survival",
    },
    {
      description: "Number of distinct event times.",
      id: "stepCount",
      kind: "integer",
      label: "Step count",
    },
    {
      description:
        "One row per distinct event time: time, survival probability, subjects at risk, deaths.",
      id: "survivalTable",
      kind: "matrix",
      label: "Survival table",
    },
  ],
  calculate: (input) =>
    calculateKaplanMeier({
      events: input.events as readonly number[],
      times: input.times as readonly number[],
    }),
});

export const runKaplanMeier = kaplanMeierTool.execute;
export default kaplanMeierTool;

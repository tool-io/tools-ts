import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly eventCountsByWindow: readonly number[];
  readonly windowDurationsDays: readonly number[];
  readonly callerRateAccelerationPerDaySquared: number;
}>;
export type Output = Readonly<{
  readonly eventRatesPerDay: readonly number[];
  readonly lastRateAccelerationPerDaySquared: number;
  readonly lastToFirstRateRatio: number;
  readonly approximateEndpointLogRateRatioStandardError: number;
  readonly aboveCallerAcceleration: boolean;
}>;
const inputFields = [
  {
    id: "eventCountsByWindow",
    label: "Event counts by window",
    kind: "numberList",
  },
  {
    id: "windowDurationsDays",
    label: "Window durations days",
    kind: "numberList",
  },
  {
    id: "callerRateAccelerationPerDaySquared",
    label: "Caller rate acceleration per day squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.eventCountsByWindow.forEach((v) => positive(v, "eventCountsByWindow"));
  input.windowDurationsDays.forEach((v) => positive(v, "windowDurationsDays"));
  input.eventCountsByWindow.forEach((v) => count(v, "eventCountsByWindow"));
  aligned(
    input.eventCountsByWindow,
    input.windowDurationsDays,
    "eventCountsByWindow",
  );
  if (input.eventCountsByWindow.length < 3)
    simpleError(
      "eventCountsByWindow",
      "At least three contiguous complete detection windows required.",
    );
  const r = input.eventCountsByWindow.map(
      (v, i) => v / input.windowDurationsDays[i],
    ),
    dt = input.windowDurationsDays,
    last = r.length - 1,
    a =
      (r[last] - r[last - 1]) / ((dt[last] + dt[last - 1]) / 2) -
      (r[last - 1] - r[last - 2]) / ((dt[last - 1] + dt[last - 2]) / 2),
    lastRateAccelerationPerDaySquared =
      a / ((dt[last - 2] + 2 * dt[last - 1] + dt[last]) / 4);
  return {
    eventRatesPerDay: r,
    lastRateAccelerationPerDaySquared,
    lastToFirstRateRatio: r[last] / r[0],
    approximateEndpointLogRateRatioStandardError: Math.sqrt(
      1 / input.eventCountsByWindow[0] + 1 / input.eventCountsByWindow[last],
    ),
    aboveCallerAcceleration:
      lastRateAccelerationPerDaySquared >
      input.callerRateAccelerationPerDaySquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eventCountsByWindow: [10, 20, 40],
  windowDurationsDays: [1, 1, 1],
  callerRateAccelerationPerDaySquared: 5,
} satisfies Input;
export const exampleOutput = {
  eventRatesPerDay: [10, 20, 40],
  lastRateAccelerationPerDaySquared: 10,
  lastToFirstRateRatio: 4,
  approximateEndpointLogRateRatioStandardError: 0.3535533905932738,
  aboveCallerAcceleration: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/swarm-rate-acceleration-checker",
  title: "Swarm Rate Acceleration Checker",
  description:
    "Audit contiguous exposure-normalized swarm counts using midpoint second differences and a large-count independent-Poisson endpoint ratio error; no earthquake clustering correction, missing-detection inference or eruption probability.",
  inputs: inputFields,
  outputs: [
    {
      id: "eventRatesPerDay",
      label: "Event rates per day",
      kind: "numberList",
    },
    {
      id: "lastRateAccelerationPerDaySquared",
      label: "Last rate acceleration per day squared",
      kind: "number",
    },
    {
      id: "lastToFirstRateRatio",
      label: "Last to first rate ratio",
      kind: "number",
    },
    {
      id: "approximateEndpointLogRateRatioStandardError",
      label: "Approximate endpoint log rate ratio standard error",
      kind: "number",
    },
    {
      id: "aboveCallerAcceleration",
      label: "Above caller acceleration",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      eventCountsByWindow: value.eventCountsByWindow as readonly number[],
      windowDurationsDays: value.windowDurationsDays as readonly number[],
      callerRateAccelerationPerDaySquared:
        value.callerRateAccelerationPerDaySquared as number,
    }),
});
export const run = tool.execute;
export default tool;

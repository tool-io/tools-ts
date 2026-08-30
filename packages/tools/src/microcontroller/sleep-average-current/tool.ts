import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SleepAverageCurrentInput = Readonly<{
  readonly activeMilliamperes: number;
  readonly activeSeconds: number;
  readonly sleepMilliamperes: number;
  readonly sleepSeconds: number;
}>;
export type SleepAverageCurrentOutput = Readonly<{
  readonly averageMilliamperes: number;
}>;

export const calculateSleepAverageCurrent = (
  x: SleepAverageCurrentInput,
): SleepAverageCurrentOutput => {
  if (!Number.isFinite(x.activeMilliamperes) || x.activeMilliamperes < 0)
    simpleError("activeMilliamperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.activeSeconds) || x.activeSeconds < 0)
    simpleError("activeSeconds", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.sleepMilliamperes) || x.sleepMilliamperes < 0)
    simpleError("sleepMilliamperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.sleepSeconds) || x.sleepSeconds < 0)
    simpleError("sleepSeconds", "Provide a finite number at least 0.");
  const averageMilliamperes =
    (x.activeMilliamperes * x.activeSeconds +
      x.sleepMilliamperes * x.sleepSeconds) /
    (x.activeSeconds + x.sleepSeconds);
  if (!Number.isFinite(averageMilliamperes))
    simpleError(
      "averageMilliamperes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    averageMilliamperes: Object.is(averageMilliamperes, -0)
      ? 0
      : averageMilliamperes,
  };
};

export const example = {
  input: {
    activeMilliamperes: 10,
    activeSeconds: 1,
    sleepMilliamperes: 0.01,
    sleepSeconds: 9,
  },
  output: { averageMilliamperes: 1.009 },
} satisfies ToolExample<SleepAverageCurrentInput, SleepAverageCurrentOutput>;

export const tool = createSimpleTool({
  id: "microcontroller/sleep-average-current",
  title: "Sleep Average Current",
  description:
    "Time-weighted average current of one active/sleep cycle; peripheral leakage outside these measured currents is not inferred.",
  inputs: [
    {
      id: "activeMilliamperes",
      kind: "number",
      label: "Active Milliamperes",
      unit: "mA",
      minimum: 0,
    },
    {
      id: "activeSeconds",
      kind: "number",
      label: "Active Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "sleepMilliamperes",
      kind: "number",
      label: "Sleep Milliamperes",
      unit: "mA",
      minimum: 0,
    },
    {
      id: "sleepSeconds",
      kind: "number",
      label: "Sleep Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "averageMilliamperes",
      kind: "number",
      label: "Average Milliamperes",
      unit: "mA",
    },
  ],
  calculate: (input) =>
    calculateSleepAverageCurrent({
      activeMilliamperes: input.activeMilliamperes as number,
      activeSeconds: input.activeSeconds as number,
      sleepMilliamperes: input.sleepMilliamperes as number,
      sleepSeconds: input.sleepSeconds as number,
    }),
});
export const sleepAverageCurrentTool = tool;
export const runSleepAverageCurrent = tool.execute;
export default tool;

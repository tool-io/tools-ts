import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuartzBatteryLifeInput = Readonly<{
  readonly usableMilliampHours: number;
  readonly averageMilliamps: number;
}>;
export type QuartzBatteryLifeOutput = Readonly<{
  readonly hours: number;
}>;

export const calculateQuartzBatteryLife = (
  x: QuartzBatteryLifeInput,
): QuartzBatteryLifeOutput => {
  if (!Number.isFinite(x.usableMilliampHours) || x.usableMilliampHours <= 0)
    simpleError("usableMilliampHours", "Provide a finite positive number.");
  if (!Number.isFinite(x.averageMilliamps) || x.averageMilliamps <= 0)
    simpleError("averageMilliamps", "Provide a finite positive number.");
  const hours = x.usableMilliampHours / x.averageMilliamps;
  if (!Number.isFinite(hours))
    simpleError("hours", "Inputs produce an undefined or out-of-range result.");
  return { hours: Object.is(hours, -0) ? 0 : hours };
};

export const example = {
  input: {
    usableMilliampHours: 100,
    averageMilliamps: 0.01,
  },
  output: { hours: 10000 },
} satisfies ToolExample<QuartzBatteryLifeInput, QuartzBatteryLifeOutput>;

export const tool = createSimpleTool({
  id: "horology/quartz-battery-life",
  title: "Quartz Battery Life",
  description:
    "Ideal quartz-watch battery life in hours from usable mAh capacity and average mA draw.",
  inputs: [
    {
      id: "usableMilliampHours",
      kind: "number",
      label: "Usable Milliamp Hours",
      unit: "mAh",
      minimum: 0,
    },
    {
      id: "averageMilliamps",
      kind: "number",
      label: "Average Milliamps",
      unit: "mA",
      minimum: 0,
    },
  ],
  outputs: [{ id: "hours", kind: "number", label: "Hours", unit: "h" }],
  calculate: (input) =>
    calculateQuartzBatteryLife({
      usableMilliampHours: input.usableMilliampHours as number,
      averageMilliamps: input.averageMilliamps as number,
    }),
});
export const quartzBatteryLifeTool = tool;
export const runQuartzBatteryLife = tool.execute;
export default tool;

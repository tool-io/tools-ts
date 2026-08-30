import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuartzPpmToMonthSecondsInput = Readonly<{
  readonly errorPpm: number;
  readonly daysInMonth: number;
}>;
export type QuartzPpmToMonthSecondsOutput = Readonly<{
  readonly driftSeconds: number;
}>;

export const calculateQuartzPpmToMonthSeconds = (
  x: QuartzPpmToMonthSecondsInput,
): QuartzPpmToMonthSecondsOutput => {
  if (!Number.isFinite(x.errorPpm))
    simpleError("errorPpm", "Provide a finite number.");
  if (
    !Number.isFinite(x.daysInMonth) ||
    !Number.isSafeInteger(x.daysInMonth) ||
    x.daysInMonth < 1
  )
    simpleError("daysInMonth", "Provide a positive safe integer.");
  if (!(x.daysInMonth <= 31))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const driftSeconds = (x.errorPpm * 86400 * x.daysInMonth) / 1e6;
  if (!Number.isFinite(driftSeconds))
    simpleError(
      "driftSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { driftSeconds: Object.is(driftSeconds, -0) ? 0 : driftSeconds };
};

export const example = {
  input: {
    errorPpm: 10,
    daysInMonth: 30,
  },
  output: { driftSeconds: 25.92 },
} satisfies ToolExample<
  QuartzPpmToMonthSecondsInput,
  QuartzPpmToMonthSecondsOutput
>;

export const tool = createSimpleTool({
  id: "horology/quartz-ppm-to-month-seconds",
  title: "Quartz Ppm To Month Seconds",
  description:
    "Signed accumulated timing error in seconds over a month with a supplied number of days.",
  inputs: [
    { id: "errorPpm", kind: "number", label: "Error Ppm", unit: "ppm" },
    {
      id: "daysInMonth",
      kind: "integer",
      label: "Days In Month",
      unit: "day",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "driftSeconds", kind: "number", label: "Drift Seconds", unit: "s" },
  ],
  calculate: (input) =>
    calculateQuartzPpmToMonthSeconds({
      errorPpm: input.errorPpm as number,
      daysInMonth: input.daysInMonth as number,
    }),
});
export const quartzPpmToMonthSecondsTool = tool;
export const runQuartzPpmToMonthSeconds = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DecimalMinutesScaleInput = Readonly<{
  readonly elapsedSeconds: number;
}>;
export type DecimalMinutesScaleOutput = Readonly<{
  readonly hundredthsOfMinute: number;
}>;

export const calculateDecimalMinutesScale = (
  x: DecimalMinutesScaleInput,
): DecimalMinutesScaleOutput => {
  if (!Number.isFinite(x.elapsedSeconds) || x.elapsedSeconds < 0)
    simpleError("elapsedSeconds", "Provide a finite nonnegative number.");
  const hundredthsOfMinute = (100 * x.elapsedSeconds) / 60;
  if (!Number.isFinite(hundredthsOfMinute))
    simpleError(
      "hundredthsOfMinute",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    hundredthsOfMinute: Object.is(hundredthsOfMinute, -0)
      ? 0
      : hundredthsOfMinute,
  };
};

export const example = {
  input: {
    elapsedSeconds: 30,
  },
  output: { hundredthsOfMinute: 50 },
} satisfies ToolExample<DecimalMinutesScaleInput, DecimalMinutesScaleOutput>;

export const tool = createSimpleTool({
  id: "horology/decimal-minutes-scale",
  title: "Decimal Minutes Scale",
  description:
    "Hundredths of a minute from an elapsed number of conventional seconds.",
  inputs: [
    {
      id: "elapsedSeconds",
      kind: "number",
      label: "Elapsed Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "hundredthsOfMinute", kind: "number", label: "Hundredths Of Minute" },
  ],
  calculate: (input) =>
    calculateDecimalMinutesScale({
      elapsedSeconds: input.elapsedSeconds as number,
    }),
});
export const decimalMinutesScaleTool = tool;
export const runDecimalMinutesScale = tool.execute;
export default tool;

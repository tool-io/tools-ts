import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PowerReserveDepletionInput = Readonly<{
  readonly startingReserveHours: number;
  readonly elapsedHours: number;
}>;
export type PowerReserveDepletionOutput = Readonly<{
  readonly remainingHours: number;
}>;

export const calculatePowerReserveDepletion = (
  x: PowerReserveDepletionInput,
): PowerReserveDepletionOutput => {
  if (!Number.isFinite(x.startingReserveHours) || x.startingReserveHours < 0)
    simpleError("startingReserveHours", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.elapsedHours) || x.elapsedHours < 0)
    simpleError("elapsedHours", "Provide a finite nonnegative number.");
  if (!(x.elapsedHours <= x.startingReserveHours))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const remainingHours = x.startingReserveHours - x.elapsedHours;
  if (!Number.isFinite(remainingHours))
    simpleError(
      "remainingHours",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { remainingHours: Object.is(remainingHours, -0) ? 0 : remainingHours };
};

export const example = {
  input: {
    startingReserveHours: 48,
    elapsedHours: 12,
  },
  output: { remainingHours: 36 },
} satisfies ToolExample<
  PowerReserveDepletionInput,
  PowerReserveDepletionOutput
>;

export const tool = createSimpleTool({
  id: "horology/power-reserve-depletion",
  title: "Power Reserve Depletion",
  description:
    "Remaining power-reserve hours after elapsed running hours, with no winding during the interval.",
  inputs: [
    {
      id: "startingReserveHours",
      kind: "number",
      label: "Starting Reserve Hours",
      unit: "h",
      minimum: 0,
    },
    {
      id: "elapsedHours",
      kind: "number",
      label: "Elapsed Hours",
      unit: "h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "remainingHours",
      kind: "number",
      label: "Remaining Hours",
      unit: "h",
    },
  ],
  calculate: (input) =>
    calculatePowerReserveDepletion({
      startingReserveHours: input.startingReserveHours as number,
      elapsedHours: input.elapsedHours as number,
    }),
});
export const powerReserveDepletionTool = tool;
export const runPowerReserveDepletion = tool.execute;
export default tool;

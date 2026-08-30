import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DaysOnMarketInput = Readonly<{
  readonly listedAtUnixMilliseconds: number;
  readonly observedAtUnixMilliseconds: number;
}>;
export type DaysOnMarketOutput = Readonly<{
  readonly elapsedDays: number;
}>;

export const calculateDaysOnMarket = (
  x: DaysOnMarketInput,
): DaysOnMarketOutput => {
  if (
    !Number.isFinite(x.listedAtUnixMilliseconds) ||
    x.listedAtUnixMilliseconds < 0
  )
    simpleError(
      "listedAtUnixMilliseconds",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.observedAtUnixMilliseconds) ||
    x.observedAtUnixMilliseconds < 0
  )
    simpleError(
      "observedAtUnixMilliseconds",
      "Provide a finite nonnegative number.",
    );
  if (!(x.observedAtUnixMilliseconds >= x.listedAtUnixMilliseconds))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const elapsedDays =
    (x.observedAtUnixMilliseconds - x.listedAtUnixMilliseconds) / 86400000;
  if (!Number.isFinite(elapsedDays))
    simpleError(
      "elapsedDays",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { elapsedDays: Object.is(elapsedDays, -0) ? 0 : elapsedDays };
};

export const example = {
  input: {
    listedAtUnixMilliseconds: 0,
    observedAtUnixMilliseconds: 172800000,
  },
  output: { elapsedDays: 2 },
} satisfies ToolExample<DaysOnMarketInput, DaysOnMarketOutput>;

export const tool = createSimpleTool({
  id: "real-estate/days-on-market",
  title: "Days On Market",
  description:
    "Elapsed days, including fractional days, from a listing timestamp to a sale or observation timestamp; both use Unix milliseconds.",
  inputs: [
    {
      id: "listedAtUnixMilliseconds",
      kind: "number",
      label: "Listed At Unix Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "observedAtUnixMilliseconds",
      kind: "number",
      label: "Observed At Unix Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "elapsedDays", kind: "number", label: "Elapsed Days", unit: "day" },
  ],
  calculate: (input) =>
    calculateDaysOnMarket({
      listedAtUnixMilliseconds: input.listedAtUnixMilliseconds as number,
      observedAtUnixMilliseconds: input.observedAtUnixMilliseconds as number,
    }),
});
export const daysOnMarketTool = tool;
export const runDaysOnMarket = tool.execute;
export default tool;

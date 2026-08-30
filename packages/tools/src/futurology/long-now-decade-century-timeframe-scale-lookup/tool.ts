import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LongNowTimeframeInput = {
  readonly horizonYears: ReadonlyArray<number>;
};

export type LongNowTimeframeOutput = {
  readonly centuryEquivalent: number;
  readonly decadeCounts: ReadonlyArray<number>;
  readonly totalYears: number;
};

export const calculateLongNowTimeframes = (
  input: LongNowTimeframeInput,
): LongNowTimeframeOutput => {
  if (!Array.isArray(input.horizonYears))
    simpleError(
      "horizonYears",
      "Horizon years must be an array.",
      "horizon_years_required",
    );
  const decadeCounts: number[] = [];
  let totalYears = 0;
  for (const [index, years] of input.horizonYears.entries()) {
    if (!Number.isFinite(years) || years < 0)
      simpleError(
        `horizonYears.${index}`,
        "Horizon years must be finite and nonnegative.",
        "invalid_horizon_years",
      );
    const decades = years / 10;
    if (!Number.isFinite(decades))
      simpleError(
        `horizonYears.${index}`,
        "Decade conversion is not finite.",
        "result_not_finite",
      );
    decadeCounts.push(decades);
    totalYears += years;
    if (!Number.isFinite(totalYears))
      simpleError(
        `horizonYears.${index}`,
        "Total years are not finite.",
        "result_not_finite",
      );
  }
  return { centuryEquivalent: totalYears / 100, decadeCounts, totalYears };
};

export const longNowTimeframeExample = {
  input: { horizonYears: [10, 100, 1000] },
  output: {
    centuryEquivalent: 11.1,
    decadeCounts: [1, 10, 100],
    totalYears: 1110,
  },
} satisfies ToolExample<LongNowTimeframeInput, LongNowTimeframeOutput>;

export const longNowTimeframeTool = createSimpleTool({
  calculate: (input) =>
    calculateLongNowTimeframes({
      horizonYears: input.horizonYears as number[],
    }),
  description:
    "Convert caller-supplied long-term horizon years into decade counts, total years, and century equivalents.",
  id: "futurology/long-now-decade-century-timeframe-scale-lookup",
  inputs: [{ id: "horizonYears", kind: "numberList", label: "Horizon years" }],
  outputs: [
    {
      id: "centuryEquivalent",
      kind: "number",
      label: "Century equivalent",
      minimum: 0,
    },
    { id: "decadeCounts", kind: "numberList", label: "Decade equivalents" },
    { id: "totalYears", kind: "number", label: "Total years", minimum: 0 },
  ],
  title: "Long Now Decade Century Timeframe Scale Lookup",
});

export const runLongNowTimeframe = longNowTimeframeTool.execute;
export default longNowTimeframeTool;

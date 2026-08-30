import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SoilConsolidationTimeFactorInput = Readonly<{
  readonly consolidationCoefficientSquareMetersPerSecond: number;
  readonly timeSeconds: number;
  readonly drainagePathMeters: number;
}>;
export type SoilConsolidationTimeFactorOutput = Readonly<{
  readonly timeFactor: number;
}>;

export const calculateSoilConsolidationTimeFactor = (
  x: SoilConsolidationTimeFactorInput,
): SoilConsolidationTimeFactorOutput => {
  if (
    !Number.isFinite(x.consolidationCoefficientSquareMetersPerSecond) ||
    x.consolidationCoefficientSquareMetersPerSecond < 0
  )
    simpleError(
      "consolidationCoefficientSquareMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.timeSeconds) || x.timeSeconds < 0)
    simpleError("timeSeconds", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.drainagePathMeters) || x.drainagePathMeters < 0)
    simpleError("drainagePathMeters", "Provide a finite number at least 0.");
  const timeFactor =
    (x.consolidationCoefficientSquareMetersPerSecond * x.timeSeconds) /
    x.drainagePathMeters ** 2;
  if (!Number.isFinite(timeFactor))
    simpleError(
      "timeFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { timeFactor: Object.is(timeFactor, -0) ? 0 : timeFactor };
};

export const example = {
  input: {
    consolidationCoefficientSquareMetersPerSecond: 0.000001,
    timeSeconds: 86400,
    drainagePathMeters: 1,
  },
  output: { timeFactor: 0.08639999999999999 },
} satisfies ToolExample<
  SoilConsolidationTimeFactorInput,
  SoilConsolidationTimeFactorOutput
>;

export const tool = createSimpleTool({
  id: "engineering/soil-consolidation-time-factor",
  title: "Soil Consolidation Time Factor",
  description:
    "Dimensionless one-dimensional consolidation time factor Tv=cv·t/Hdr² with consistent SI units.",
  inputs: [
    {
      id: "consolidationCoefficientSquareMetersPerSecond",
      kind: "number",
      label: "Consolidation Coefficient Square Meters Per Second",
      unit: "m²/s",
      minimum: 0,
    },
    {
      id: "timeSeconds",
      kind: "number",
      label: "Time Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "drainagePathMeters",
      kind: "number",
      label: "Drainage Path Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [{ id: "timeFactor", kind: "number", label: "Time Factor" }],
  calculate: (input) =>
    calculateSoilConsolidationTimeFactor({
      consolidationCoefficientSquareMetersPerSecond:
        input.consolidationCoefficientSquareMetersPerSecond as number,
      timeSeconds: input.timeSeconds as number,
      drainagePathMeters: input.drainagePathMeters as number,
    }),
});
export const soilConsolidationTimeFactorTool = tool;
export const runSoilConsolidationTimeFactor = tool.execute;
export default tool;

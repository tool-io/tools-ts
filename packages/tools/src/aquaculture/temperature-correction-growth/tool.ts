import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TemperatureCorrectionGrowthInput = Readonly<{
  readonly baselineGrowthRate: number;
  readonly q10Factor: number;
  readonly baselineTemperatureCelsius: number;
  readonly targetTemperatureCelsius: number;
}>;
export type TemperatureCorrectionGrowthOutput = Readonly<{
  readonly adjustedGrowthRate: number;
}>;

export const calculateTemperatureCorrectionGrowth = (
  x: TemperatureCorrectionGrowthInput,
): TemperatureCorrectionGrowthOutput => {
  if (!Number.isFinite(x.baselineGrowthRate) || x.baselineGrowthRate < 0)
    simpleError("baselineGrowthRate", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.q10Factor) || x.q10Factor < 0)
    simpleError("q10Factor", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.baselineTemperatureCelsius))
    simpleError("baselineTemperatureCelsius", "Provide a finite number.");
  if (!Number.isFinite(x.targetTemperatureCelsius))
    simpleError("targetTemperatureCelsius", "Provide a finite number.");
  if (x.q10Factor <= 0)
    simpleError("q10Factor", "Q10 factor must be positive.");
  const adjustedGrowthRate =
    x.baselineGrowthRate *
    x.q10Factor **
      ((x.targetTemperatureCelsius - x.baselineTemperatureCelsius) / 10);
  if (!Number.isFinite(adjustedGrowthRate))
    simpleError(
      "adjustedGrowthRate",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    adjustedGrowthRate: Object.is(adjustedGrowthRate, -0)
      ? 0
      : adjustedGrowthRate,
  };
};

export const example = {
  input: {
    baselineGrowthRate: 10,
    q10Factor: 2,
    baselineTemperatureCelsius: 20,
    targetTemperatureCelsius: 30,
  },
  output: { adjustedGrowthRate: 20 },
} satisfies ToolExample<
  TemperatureCorrectionGrowthInput,
  TemperatureCorrectionGrowthOutput
>;

export const tool = createSimpleTool({
  id: "aquaculture/temperature-correction-growth",
  title: "Temperature Correction Growth",
  description:
    "Apply a user-supplied Q10 growth-rate factor over a temperature difference; this is an empirical extrapolation, not a husbandry recommendation.",
  inputs: [
    {
      id: "baselineGrowthRate",
      kind: "number",
      label: "Baseline Growth Rate",
      unit: "g/day",
    },
    { id: "q10Factor", kind: "number", label: "Q10 Factor", unit: "ratio" },
    {
      id: "baselineTemperatureCelsius",
      kind: "number",
      label: "Baseline Temperature Celsius",
      unit: "°C",
    },
    {
      id: "targetTemperatureCelsius",
      kind: "number",
      label: "Target Temperature Celsius",
      unit: "°C",
    },
  ],
  outputs: [
    {
      id: "adjustedGrowthRate",
      kind: "number",
      label: "Adjusted Growth Rate",
      unit: "g/day",
    },
  ],
  calculate: (input) =>
    calculateTemperatureCorrectionGrowth({
      baselineGrowthRate: input.baselineGrowthRate as number,
      q10Factor: input.q10Factor as number,
      baselineTemperatureCelsius: input.baselineTemperatureCelsius as number,
      targetTemperatureCelsius: input.targetTemperatureCelsius as number,
    }),
});
export const runTemperatureCorrectionGrowth = tool.execute;
export default tool;

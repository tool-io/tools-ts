import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaterExchangeRateInput = Readonly<{
  readonly replacementVolumeCubicMetersPerDay: number;
  readonly systemVolumeCubicMeters: number;
}>;
export type WaterExchangeRateOutput = Readonly<{
  readonly dailyExchangePercent: number;
}>;

export const calculateWaterExchangeRate = (
  x: WaterExchangeRateInput,
): WaterExchangeRateOutput => {
  if (
    !Number.isFinite(x.replacementVolumeCubicMetersPerDay) ||
    x.replacementVolumeCubicMetersPerDay < 0
  )
    simpleError(
      "replacementVolumeCubicMetersPerDay",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.systemVolumeCubicMeters) ||
    x.systemVolumeCubicMeters <= 0
  )
    simpleError("systemVolumeCubicMeters", "Provide a finite positive number.");
  const dailyExchangePercent =
    (x.replacementVolumeCubicMetersPerDay / x.systemVolumeCubicMeters) * 100;
  if (!Number.isFinite(dailyExchangePercent))
    simpleError(
      "dailyExchangePercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    dailyExchangePercent: Object.is(dailyExchangePercent, -0)
      ? 0
      : dailyExchangePercent,
  };
};

export const example = {
  input: {
    replacementVolumeCubicMetersPerDay: 20,
    systemVolumeCubicMeters: 100,
  },
  output: { dailyExchangePercent: 20 },
} satisfies ToolExample<WaterExchangeRateInput, WaterExchangeRateOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/water-exchange-rate",
  title: "Water Exchange Rate",
  description:
    "Express daily replacement water volume as a percentage of system volume.",
  inputs: [
    {
      id: "replacementVolumeCubicMetersPerDay",
      kind: "number",
      label: "Replacement Volume Cubic Meters Per Day",
      unit: "m³/day",
    },
    {
      id: "systemVolumeCubicMeters",
      kind: "number",
      label: "System Volume Cubic Meters",
      unit: "m³",
    },
  ],
  outputs: [
    {
      id: "dailyExchangePercent",
      kind: "number",
      label: "Daily Exchange Percent",
      unit: "%/day",
    },
  ],
  calculate: (input) =>
    calculateWaterExchangeRate({
      replacementVolumeCubicMetersPerDay:
        input.replacementVolumeCubicMetersPerDay as number,
      systemVolumeCubicMeters: input.systemVolumeCubicMeters as number,
    }),
});
export const runWaterExchangeRate = tool.execute;
export default tool;

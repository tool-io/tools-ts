import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WmapeForecastAccuracyLogisticsInput = {
  readonly actualUnits: readonly number[];
  readonly forecastUnits: readonly number[];
};

export type WmapeForecastAccuracyLogisticsOutput = {
  readonly absoluteErrorTotal: number;
  readonly actualTotal: number;
  readonly biasPercent: number;
  readonly wmapePercent: number;
};

export const calculateWmapeForecastAccuracyLogistics = (
  input: WmapeForecastAccuracyLogisticsInput,
): WmapeForecastAccuracyLogisticsOutput => {
  const actualUnits = [...input.actualUnits];
  const forecastUnits = [...input.forecastUnits];
  if (actualUnits.length === 0)
    return simpleError(
      "actualUnits",
      "At least one observation is required.",
      "empty_sample",
    );
  if (actualUnits.length !== forecastUnits.length)
    return simpleError(
      "forecastUnits",
      "Actual and forecast series must have equal length.",
      "length_mismatch",
    );
  for (let index = 0; index < actualUnits.length; index += 1) {
    if (!Number.isFinite(actualUnits[index]) || actualUnits[index] < 0)
      return simpleError(
        "actualUnits",
        `Actual value at index ${index} must be finite and non-negative.`,
        "invalid_actuals",
      );
    if (!Number.isFinite(forecastUnits[index]) || forecastUnits[index] < 0)
      return simpleError(
        "forecastUnits",
        `Forecast value at index ${index} must be finite and non-negative.`,
        "invalid_forecasts",
      );
  }
  const actualTotal = actualUnits.reduce((sum, value) => sum + value, 0);
  if (!(actualTotal > 0))
    return simpleError(
      "actualUnits",
      "Sum of actual units must be greater than zero.",
      "invalid_actuals",
    );
  const forecastTotal = forecastUnits.reduce((sum, value) => sum + value, 0);
  const absoluteErrorTotal = actualUnits.reduce(
    (sum, value, index) => sum + Math.abs(value - forecastUnits[index]),
    0,
  );
  if (
    !Number.isFinite(actualTotal) ||
    !Number.isFinite(forecastTotal) ||
    !Number.isFinite(absoluteErrorTotal)
  )
    return simpleError(
      "actualUnits",
      "The series totals are outside the representable range.",
      "total_out_of_range",
    );
  const biasTotal = forecastTotal - actualTotal;
  const biasPercent = (biasTotal / actualTotal) * 100;
  const wmapePercent = (absoluteErrorTotal / actualTotal) * 100;
  if (!Number.isFinite(biasPercent) || !Number.isFinite(wmapePercent))
    return simpleError(
      "forecastUnits",
      "The forecast percentages are outside the representable range.",
      "percent_out_of_range",
    );
  return {
    absoluteErrorTotal,
    actualTotal,
    biasPercent,
    wmapePercent,
  };
};

export const wmapeForecastAccuracyLogisticsExample = {
  input: {
    actualUnits: [120, 140, 90, 160],
    forecastUnits: [110, 150, 100, 155],
  },
  output: {
    absoluteErrorTotal: 35,
    actualTotal: 510,
    biasPercent: 0.9803921568627451,
    wmapePercent: 6.862745098039216,
  },
} satisfies ToolExample<
  WmapeForecastAccuracyLogisticsInput,
  WmapeForecastAccuracyLogisticsOutput
>;

export const wmapeForecastAccuracyLogisticsTool = createSimpleTool({
  id: "logistics/wmape-forecast-accuracy-logistics",
  title: "WMAPE Forecast Accuracy for Logistics",
  description:
    "Score demand-plan accuracy with weighted mean absolute percentage error (total absolute error over total actual demand) plus signed bias, the volume-weighted standard for SKU forecasts.",
  inputs: [
    {
      description: "Actual demand units per period.",
      id: "actualUnits",
      kind: "numberList",
      label: "Actual units",
    },
    {
      description: "Forecasted units per period, aligned to actuals.",
      id: "forecastUnits",
      kind: "numberList",
      label: "Forecast units",
    },
  ],
  outputs: [
    {
      description: "Sum of absolute forecast errors in units.",
      id: "absoluteErrorTotal",
      kind: "number",
      label: "Absolute error",
    },
    {
      description: "Sum of actual demand in units.",
      id: "actualTotal",
      kind: "number",
      label: "Actual total",
    },
    {
      description: "Signed forecast bias in percent of actual total.",
      id: "biasPercent",
      kind: "number",
      label: "Bias percent",
    },
    {
      description: "Weighted MAPE in percent of total actual demand.",
      id: "wmapePercent",
      kind: "number",
      label: "WMAPE percent",
    },
  ],
  calculate: (input) =>
    calculateWmapeForecastAccuracyLogistics({
      actualUnits: input.actualUnits as readonly number[],
      forecastUnits: input.forecastUnits as readonly number[],
    }),
});

export const runWmapeForecastAccuracyLogistics =
  wmapeForecastAccuracyLogisticsTool.execute;
export default wmapeForecastAccuracyLogisticsTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const morelSoilDegreeDayAccumulatorExample = {
  input: { daysElapsedInt: 5, soilTempC: 14 },
  output: { accumulatedDegreeDays: 20 },
} satisfies ToolExample<
  {
    readonly daysElapsedInt: number;
    readonly soilTempC: number;
    readonly thresholdC?: number;
  },
  {
    readonly accumulatedDegreeDays: number;
  }
>;

export const morelSoilDegreeDayAccumulatorTool = createSimpleTool({
  id: "mycology/morel-soil-degree-day-accumulator",
  title: "Morel Degree Days",
  description:
    "Accumulate morel soil degree days as positive soil temperature above the threshold times elapsed days, clamped at zero below the threshold.",
  inputs: [
    {
      id: "soilTempC",
      label: "Soil temperature",
      kind: "number",
      minimum: -273.15,
      unit: "°C",
    },
    {
      default: 10,
      id: "thresholdC",
      label: "Threshold temperature",
      kind: "number",
      minimum: -273.15,
      unit: "°C",
    },
    {
      id: "daysElapsedInt",
      label: "Days elapsed",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "accumulatedDegreeDays",
      label: "Accumulated degree days",
      kind: "number",
      minimum: 0,
      unit: "°C·day",
    },
  ],
  calculate: (input) => ({
    accumulatedDegreeDays:
      Math.max(0, (input.soilTempC as number) - (input.thresholdC as number)) *
      (input.daysElapsedInt as number),
  }),
});
export const runMorelSoilDegreeDayAccumulator =
  morelSoilDegreeDayAccumulatorTool.execute;
export default morelSoilDegreeDayAccumulatorTool;

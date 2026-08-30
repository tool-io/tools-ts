import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaterDemandAverageInput = Readonly<{
  readonly population: number;
  readonly litersPerPersonPerDay: number;
}>;
export type WaterDemandAverageOutput = Readonly<{
  readonly cubicMetersPerDay: number;
}>;

export const calculateWaterDemandAverage = (
  x: WaterDemandAverageInput,
): WaterDemandAverageOutput => {
  if (!Number.isFinite(x.population) || x.population < 0)
    simpleError("population", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.litersPerPersonPerDay) || x.litersPerPersonPerDay < 0)
    simpleError("litersPerPersonPerDay", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.population))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const cubicMetersPerDay = (x.population * x.litersPerPersonPerDay) / 1000;
  if (!Number.isFinite(cubicMetersPerDay))
    simpleError(
      "cubicMetersPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    cubicMetersPerDay: Object.is(cubicMetersPerDay, -0) ? 0 : cubicMetersPerDay,
  };
};

export const example = {
  input: { population: 1000, litersPerPersonPerDay: 150 },
  output: { cubicMetersPerDay: 150 },
} satisfies ToolExample<WaterDemandAverageInput, WaterDemandAverageOutput>;

export const tool = createSimpleTool({
  id: "engineering/water-demand-average",
  title: "Water Demand Average",
  description:
    "Average daily municipal water volume from served population and specified liters consumed per person per day.",
  inputs: [
    { id: "population", kind: "integer", label: "Population", minimum: 0 },
    {
      id: "litersPerPersonPerDay",
      kind: "number",
      label: "Liters Per Person Per Day",
      unit: "L/person/day",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "cubicMetersPerDay",
      kind: "number",
      label: "Cubic Meters Per Day",
      unit: "m³/day",
    },
  ],
  calculate: (input) =>
    calculateWaterDemandAverage({
      population: input.population as number,
      litersPerPersonPerDay: input.litersPerPersonPerDay as number,
    }),
});
export const waterDemandAverageTool = tool;
export const runWaterDemandAverage = tool.execute;
export default tool;

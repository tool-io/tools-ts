import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cardinalTempsRecorderExample = {
  input: { maximumC: 55, minimumC: 5, optimumC: 30 },
  output: {
    minGrowthC: 5,
    optimumGrowthC: 30,
    maxGrowthC: 55,
  },
} satisfies ToolExample<
  {
    readonly maximumC: number;
    readonly minimumC: number;
    readonly optimumC: number;
  },
  {
    readonly maxGrowthC: number;
    readonly minGrowthC: number;
    readonly optimumGrowthC: number;
  }
>;

export const cardinalTempsRecorderTool = createSimpleTool({
  id: "mycology/thermophile-cardinal-temps-recorder",
  title: "Cardinal Temperature Recorder",
  description:
    "Record minimum, optimum, and maximum fungal growth temperatures after validating their order; the values themselves determine whether a thermophile label is appropriate.",
  inputs: [
    {
      id: "minimumC",
      kind: "number",
      label: "Minimum temperature",
      minimum: -273.15,
      unit: "°C",
    },
    {
      id: "optimumC",
      kind: "number",
      label: "Optimum temperature",
      minimum: -273.15,
      unit: "°C",
    },
    {
      id: "maximumC",
      kind: "number",
      label: "Maximum temperature",
      minimum: -273.15,
      unit: "°C",
    },
  ],
  outputs: [
    {
      id: "minGrowthC",
      kind: "number",
      label: "Minimum growth temperature",
      unit: "°C",
    },
    {
      id: "optimumGrowthC",
      kind: "number",
      label: "Optimum growth temperature",
      unit: "°C",
    },
    {
      id: "maxGrowthC",
      kind: "number",
      label: "Maximum growth temperature",
      unit: "°C",
    },
  ],
  calculate: (input) => {
    const minimum = input.minimumC as number;
    const optimum = input.optimumC as number;
    const maximum = input.maximumC as number;
    if (!(minimum <= optimum && optimum <= maximum))
      simpleError(
        "optimumC",
        "Cardinal temperatures must satisfy minimum <= optimum <= maximum.",
        "invalid_cardinal_order",
      );
    return {
      minGrowthC: minimum,
      optimumGrowthC: optimum,
      maxGrowthC: maximum,
    };
  },
});
export const runCardinalTempsRecorder = cardinalTempsRecorderTool.execute;
export default cardinalTempsRecorderTool;

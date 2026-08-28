import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const reducedTemperatureTool = createSimpleTool({
  id: "chemistry/reduced-temperature",
  title: "Reduced Temperature Calculator",
  description: "Compute dimensionless Tr = T/Tc.",
  inputs: [
    {
      id: "temperatureK",
      label: "Temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
    {
      id: "criticalTemperatureK",
      label: "Tc",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
  ],
  outputs: [{ id: "reducedTemperature", label: "Tr", kind: "number" }],
  calculate: (input) => {
    const tc = input.criticalTemperatureK as number;
    if (tc <= 0)
      simpleError("criticalTemperatureK", ">0 required.", "invalid_tc");
    return { reducedTemperature: (input.temperatureK as number) / tc };
  },
});
export const runReducedTemperature = reducedTemperatureTool.execute;
export default reducedTemperatureTool;

export type ReducedTemperatureInput = {
  readonly temperatureK: number;
  readonly criticalTemperatureK: number;
};

export type ReducedTemperatureOutput = {
  readonly reducedTemperature: number;
};

export const reducedTemperatureExample = {
  input: {
    temperatureK: 1,
    criticalTemperatureK: 1,
  },
  output: {
    reducedTemperature: 1,
  },
} satisfies ToolExample<ReducedTemperatureInput, ReducedTemperatureOutput>;

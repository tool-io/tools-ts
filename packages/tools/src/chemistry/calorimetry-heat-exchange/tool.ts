import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const calorimetryHeatExchangeTool = createSimpleTool({
  id: "chemistry/calorimetry-heat-exchange",
  title: "Calorimetry Heat Exchange Calculator",
  description: "Calculate calorimetry heat exchange calculator.",
  inputs: [
    {
      description: "Heat lost by hot object.",
      id: "heatLostJ",
      kind: "number",
      label: "Heat lost",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Heat gained by cold object.",
      id: "heatGainedJ",
      kind: "number",
      label: "Heat gained",
    },
  ],
  calculate: (input) => {
    return { heatGainedJ: input.heatLostJ as number };
  },
});
export default calorimetryHeatExchangeTool;
export const runCalorimetryHeatExchange = calorimetryHeatExchangeTool.execute;

export type CalorimetryHeatExchangeInput = {
  readonly heatLostJ: number;
};

export type CalorimetryHeatExchangeOutput = {
  readonly heatGainedJ: number;
};

export const calorimetryHeatExchangeExample = {
  input: {
    heatLostJ: 1,
  },
  output: {
    heatGainedJ: 1,
  },
} satisfies ToolExample<
  CalorimetryHeatExchangeInput,
  CalorimetryHeatExchangeOutput
>;

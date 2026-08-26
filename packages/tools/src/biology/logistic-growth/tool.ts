import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const logisticGrowthExample = {
  input: {
    capacityK: 1000,
    growthRatePerCapita: 0.5,
    initialPop: 100,
    timeUnits: 10,
  },
  output: { population: 942.8256185740149 },
} satisfies ToolExample<
  {
    readonly capacityK: number;
    readonly growthRatePerCapita: number;
    readonly initialPop: number;
    readonly timeUnits: number;
  },
  { readonly population: number }
>;

export const logisticGrowthTool = createSimpleTool({
  id: "biology/logistic-growth",
  title: "Logistic Growth Value",
  description: "Evaluate the logistic growth model at a given time.",
  inputs: [
    {
      id: "capacityK",
      kind: "number",
      label: "Carrying capacity",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "initialPop",
      kind: "number",
      label: "Initial population",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "growthRatePerCapita",
      kind: "number",
      label: "Growth rate per capita",
      minimum: Number.MIN_VALUE,
      unit: "1/time",
    },
    {
      id: "timeUnits",
      kind: "number",
      label: "Time elapsed",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "population",
      kind: "number",
      label: "Population at time t",
    },
  ],
  calculate: (input) => {
    const capacityK = input.capacityK as number;
    const initialPop = input.initialPop as number;
    return {
      population:
        capacityK /
        (1 +
          ((capacityK - initialPop) / initialPop) *
            Math.exp(
              -(input.growthRatePerCapita as number) *
                (input.timeUnits as number),
            )),
    };
  },
});
export const runLogisticGrowth = logisticGrowthTool.execute;
export default logisticGrowthTool;

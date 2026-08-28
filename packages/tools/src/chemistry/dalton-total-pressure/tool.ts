import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const daltonTotalPressureTool = createSimpleTool({
  id: "chemistry/dalton-total-pressure",
  title: "Dalton Total Pressure Calculator",
  description:
    "Sum all partial pressures in a mixture according to Dalton's law of partial pressures.",
  inputs: [
    {
      description: "All component partial pressures in the mixture.",
      id: "partialPressures",
      label: "Partial pressures",
      kind: "numberList",
      unit: "atm",
    },
  ],
  outputs: [
    {
      description: "Total pressure of the gas mixture.",
      id: "totalPressure",
      label: "Total pressure",
      kind: "number",
      unit: "atm",
    },
  ],
  calculate: (input) => {
    return {
      totalPressure: (input.partialPressures as number[]).reduce(
        (sum, value) => sum + value,
        0,
      ),
    };
  },
});
export const runDaltonTotalPressure = daltonTotalPressureTool.execute;
export default daltonTotalPressureTool;

export type DaltonTotalPressureInput = {
  readonly partialPressures: readonly number[];
};

export type DaltonTotalPressureOutput = {
  readonly totalPressure: number;
};

export const daltonTotalPressureExample = {
  input: {
    partialPressures: [1],
  },
  output: {
    totalPressure: 1,
  },
} satisfies ToolExample<DaltonTotalPressureInput, DaltonTotalPressureOutput>;

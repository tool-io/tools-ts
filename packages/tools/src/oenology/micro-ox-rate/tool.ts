import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type MicroOxRateInput = {
  readonly months: number;
  readonly oxygenMlTotal: number;
  readonly volumeLiters: number;
};

export type MicroOxRateOutput = {
  readonly rateMlPerLPerMonth: number;
};

export const microOxRateExample = {
  input: {
    months: 1,
    oxygenMlTotal: 3000,
    volumeLiters: 1000,
  },
  output: {
    rateMlPerLPerMonth: 3,
  },
} satisfies ToolExample<MicroOxRateInput, MicroOxRateOutput>;

export const calculateMicroOxRate = (
  input: MicroOxRateInput,
): MicroOxRateOutput => {
  const months = input.months;
  if (months <= 0 || input.volumeLiters <= 0)
    simpleError(
      "months",
      "Months and volume must be positive.",
      "invalid_value",
    );
  return {
    rateMlPerLPerMonth: roundStatistic(
      input.oxygenMlTotal / (input.volumeLiters * months),
    ),
  };
};

export const microOxRateTool = createSimpleTool({
  calculate: (input) =>
    calculateMicroOxRate(input as unknown as MicroOxRateInput),
  description:
    "Express a micro-oxygenation dose as milliliters of oxygen per liter of wine per month.",
  id: "oenology/micro-ox-rate",
  inputs: [
    {
      description: "Months over which the dose is delivered.",
      id: "months",
      kind: "number",
      label: "Months",
      minimum: 0,
    },
    {
      description: "Total oxygen delivered to the lot.",
      id: "oxygenMlTotal",
      kind: "number",
      label: "Oxygen",
      minimum: 0,
      unit: "mL",
    },
    {
      description: "Wine volume treated.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Average oxygen dosing rate over the supplied interval.",
      id: "rateMlPerLPerMonth",
      kind: "number",
      label: "Micro-ox rate",
      unit: "mL/L/mo",
    },
  ],
  title: "Micro-Oxygenation Rate mL/L/month Calculator",
});
export const runMicroOxRate = microOxRateTool.execute;
export default microOxRateTool;

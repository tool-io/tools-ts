import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type HeadspaceOxygenUptakeInput = {
  readonly oxygenFraction: number;
  readonly oxygenGasDensityMgPerMl: number;
  readonly headspaceMl: number;
};

export type HeadspaceOxygenUptakeOutput = {
  readonly oxygenMl: number;
  readonly oxygenMg: number;
};

export const headspaceOxygenUptakeExample = {
  input: {
    headspaceMl: 10,
    oxygenFraction: 0.2095,
    oxygenGasDensityMgPerMl: 1.429,
  },
  output: {
    oxygenMl: 2.095,
    oxygenMg: 2.993755,
  },
} satisfies ToolExample<
  HeadspaceOxygenUptakeInput,
  HeadspaceOxygenUptakeOutput
>;

export const calculateHeadspaceOxygen = (
  input: HeadspaceOxygenUptakeInput,
): HeadspaceOxygenUptakeOutput => {
  if (input.headspaceMl < 0)
    simpleError(
      "headspaceMl",
      "The headspace volume cannot be negative.",
      "invalid_value",
    );
  const oxygenMl = input.headspaceMl * input.oxygenFraction;
  return {
    oxygenMg: roundStatistic(oxygenMl * input.oxygenGasDensityMgPerMl),
    oxygenMl: roundStatistic(oxygenMl),
  };
};

export const headspaceOxygenUptakeTool = createSimpleTool({
  calculate: (input) =>
    calculateHeadspaceOxygen(input as unknown as HeadspaceOxygenUptakeInput),
  description:
    "Calculate the gaseous oxygen inventory in a headspace from its volume, oxygen fraction, and oxygen density; this is not a prediction that all headspace oxygen will dissolve into the wine.",
  id: "oenology/headspace-oxygen-uptake",
  inputs: [
    {
      description: "Air volume trapped under the closure.",
      id: "headspaceMl",
      kind: "number",
      label: "Headspace",
      minimum: 0,
      unit: "mL",
    },
    {
      description:
        "Volume fraction of oxygen in the headspace gas, from zero to one.",
      id: "oxygenFraction",
      kind: "number",
      label: "Oxygen fraction",
      maximum: 1,
      minimum: 0,
    },
    {
      description:
        "Oxygen gas density at the applicable temperature and pressure.",
      id: "oxygenGasDensityMgPerMl",
      kind: "number",
      label: "Oxygen gas density",
      minimum: 0,
      unit: "mg/mL",
    },
  ],
  outputs: [
    {
      description: "Oxygen volume held in the headspace.",
      id: "oxygenMl",
      kind: "number",
      label: "Oxygen",
      unit: "mL",
    },
    {
      description: "Oxygen mass contained in the headspace gas.",
      id: "oxygenMg",
      kind: "number",
      label: "Oxygen",
      unit: "mg",
    },
  ],
  title: "Bottle Headspace Oxygen Inventory Calculator",
});
export const runHeadspaceOxygenUptake = headspaceOxygenUptakeTool.execute;
export default headspaceOxygenUptakeTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NetAssimilationRateInput = {
  readonly daysElapsed: number;
  readonly dryMassW1G: number;
  readonly dryMassW2G: number;
  readonly leafAreaM2Average: number;
};

export type NetAssimilationRateOutput = {
  readonly narGPerM2PerDay: number;
};

export const netAssimilationRateExample = {
  input: {
    daysElapsed: 10,
    dryMassW1G: 100,
    dryMassW2G: 150,
    leafAreaM2Average: 0.5,
  },
  output: { narGPerM2PerDay: 10 },
} satisfies ToolExample<NetAssimilationRateInput, NetAssimilationRateOutput>;

export const netAssimilationRateTool = createSimpleTool({
  id: "biology/net-assimilation-rate",
  title: "Net Assimilation Rate",
  description:
    "Compute the simplified net assimilation rate in grams per square metre of leaf per day as dry mass gain divided by average leaf area times elapsed days.",
  inputs: [
    {
      id: "daysElapsed",
      kind: "number",
      label: "Elapsed time",
      unit: "days",
    },
    {
      id: "dryMassW1G",
      kind: "number",
      label: "Initial dry mass",
      minimum: 0,
      unit: "g",
    },
    {
      id: "dryMassW2G",
      kind: "number",
      label: "Final dry mass",
      minimum: 0,
      unit: "g",
    },
    {
      id: "leafAreaM2Average",
      kind: "number",
      label: "Average leaf area",
      unit: "m²",
    },
  ],
  outputs: [
    {
      id: "narGPerM2PerDay",
      kind: "number",
      label: "Net assimilation rate",
      unit: "g/m²/day",
    },
  ],
  calculate: (input) => {
    const dryMassW1G = input.dryMassW1G as number;
    const dryMassW2G = input.dryMassW2G as number;
    const leafAreaM2Average = input.leafAreaM2Average as number;
    const daysElapsed = input.daysElapsed as number;
    if (!(dryMassW2G >= dryMassW1G))
      simpleError(
        "dryMassW2G",
        "The final dry mass cannot be below the initial dry mass.",
        "invalid_masses",
      );
    if (!(leafAreaM2Average > 0))
      simpleError(
        "leafAreaM2Average",
        "The average leaf area must be greater than zero.",
      );
    if (!(daysElapsed > 0))
      simpleError(
        "daysElapsed",
        "The elapsed time must be greater than zero.",
        "degenerate_days",
      );
    return {
      narGPerM2PerDay:
        (dryMassW2G - dryMassW1G) / (leafAreaM2Average * daysElapsed),
    };
  },
});
export const runNetAssimilationRate = netAssimilationRateTool.execute;
export default netAssimilationRateTool;

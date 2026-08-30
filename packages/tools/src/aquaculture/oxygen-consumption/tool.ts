import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OxygenConsumptionInput = Readonly<{
  readonly biomassKilograms: number;
  readonly oxygenDemandGramsPerKgHour: number;
}>;
export type OxygenConsumptionOutput = Readonly<{
  readonly oxygenDemandKgPerHour: number;
}>;

export const calculateOxygenConsumption = (
  x: OxygenConsumptionInput,
): OxygenConsumptionOutput => {
  if (!Number.isFinite(x.biomassKilograms) || x.biomassKilograms < 0)
    simpleError("biomassKilograms", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.oxygenDemandGramsPerKgHour) ||
    x.oxygenDemandGramsPerKgHour < 0
  )
    simpleError(
      "oxygenDemandGramsPerKgHour",
      "Provide a finite nonnegative number.",
    );
  const oxygenDemandKgPerHour =
    (x.biomassKilograms * x.oxygenDemandGramsPerKgHour) / 1000;
  if (!Number.isFinite(oxygenDemandKgPerHour))
    simpleError(
      "oxygenDemandKgPerHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    oxygenDemandKgPerHour: Object.is(oxygenDemandKgPerHour, -0)
      ? 0
      : oxygenDemandKgPerHour,
  };
};

export const example = {
  input: {
    biomassKilograms: 1000,
    oxygenDemandGramsPerKgHour: 0.2,
  },
  output: { oxygenDemandKgPerHour: 0.2 },
} satisfies ToolExample<OxygenConsumptionInput, OxygenConsumptionOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/oxygen-consumption",
  title: "Oxygen Consumption",
  description:
    "Estimate hourly stock oxygen demand from a measured or separately specified per-kilogram rate.",
  inputs: [
    {
      id: "biomassKilograms",
      kind: "number",
      label: "Biomass Kilograms",
      unit: "kg",
    },
    {
      id: "oxygenDemandGramsPerKgHour",
      kind: "number",
      label: "Oxygen Demand Grams Per Kg Hour",
      unit: "g/(kg·h)",
    },
  ],
  outputs: [
    {
      id: "oxygenDemandKgPerHour",
      kind: "number",
      label: "Oxygen Demand Kg Per Hour",
      unit: "kg/h",
    },
  ],
  calculate: (input) =>
    calculateOxygenConsumption({
      biomassKilograms: input.biomassKilograms as number,
      oxygenDemandGramsPerKgHour: input.oxygenDemandGramsPerKgHour as number,
    }),
});
export const runOxygenConsumption = tool.execute;
export default tool;

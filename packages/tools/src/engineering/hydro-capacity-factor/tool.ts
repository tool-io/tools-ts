import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HydroCapacityFactorInput = Readonly<{
  readonly generatedMegawattHours: number;
  readonly ratedMegawatts: number;
  readonly intervalHours: number;
}>;
export type HydroCapacityFactorOutput = Readonly<{
  readonly capacityFactor: number;
}>;

export const calculateHydroCapacityFactor = (
  x: HydroCapacityFactorInput,
): HydroCapacityFactorOutput => {
  if (
    !Number.isFinite(x.generatedMegawattHours) ||
    x.generatedMegawattHours < 0
  )
    simpleError(
      "generatedMegawattHours",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.ratedMegawatts) || x.ratedMegawatts < 0)
    simpleError("ratedMegawatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.intervalHours) || x.intervalHours < 0)
    simpleError("intervalHours", "Provide a finite number at least 0.");
  if (x.generatedMegawattHours > x.ratedMegawatts * x.intervalHours)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const capacityFactor =
    x.generatedMegawattHours / (x.ratedMegawatts * x.intervalHours);
  if (!Number.isFinite(capacityFactor))
    simpleError(
      "capacityFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { capacityFactor: Object.is(capacityFactor, -0) ? 0 : capacityFactor };
};

export const example = {
  input: { generatedMegawattHours: 100, ratedMegawatts: 1, intervalHours: 200 },
  output: { capacityFactor: 0.5 },
} satisfies ToolExample<HydroCapacityFactorInput, HydroCapacityFactorOutput>;

export const tool = createSimpleTool({
  id: "engineering/hydro-capacity-factor",
  title: "Hydro Capacity Factor",
  description:
    "Hydropower capacity factor from actual generation in MWh divided by rated MW times interval hours.",
  inputs: [
    {
      id: "generatedMegawattHours",
      kind: "number",
      label: "Generated Megawatt Hours",
      unit: "MWh",
      minimum: 0,
    },
    {
      id: "ratedMegawatts",
      kind: "number",
      label: "Rated Megawatts",
      unit: "MW",
      minimum: 0,
    },
    {
      id: "intervalHours",
      kind: "number",
      label: "Interval Hours",
      unit: "h",
      minimum: 0,
    },
  ],
  outputs: [{ id: "capacityFactor", kind: "number", label: "Capacity Factor" }],
  calculate: (input) =>
    calculateHydroCapacityFactor({
      generatedMegawattHours: input.generatedMegawattHours as number,
      ratedMegawatts: input.ratedMegawatts as number,
      intervalHours: input.intervalHours as number,
    }),
});
export const hydroCapacityFactorTool = tool;
export const runHydroCapacityFactor = tool.execute;
export default tool;

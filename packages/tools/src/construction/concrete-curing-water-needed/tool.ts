import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteCuringWaterNeededInput = Readonly<{
  readonly exposedSquareMeters: number;
  readonly litersPerSquareMeterPerDay: number;
  readonly days: number;
}>;
export type ConcreteCuringWaterNeededOutput = Readonly<{
  readonly waterLiters: number;
}>;

export const calculateConcreteCuringWaterNeeded = (
  x: ConcreteCuringWaterNeededInput,
): ConcreteCuringWaterNeededOutput => {
  if (!Number.isFinite(x.exposedSquareMeters) || x.exposedSquareMeters < 0)
    simpleError("exposedSquareMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.litersPerSquareMeterPerDay) ||
    x.litersPerSquareMeterPerDay < 0
  )
    simpleError(
      "litersPerSquareMeterPerDay",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.days) || x.days < 0)
    simpleError("days", "Provide a finite number at least 0.");
  const waterLiters =
    x.exposedSquareMeters * x.litersPerSquareMeterPerDay * x.days;
  if (!Number.isFinite(waterLiters))
    simpleError(
      "waterLiters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { waterLiters: Object.is(waterLiters, -0) ? 0 : waterLiters };
};

export const example = {
  input: { exposedSquareMeters: 100, litersPerSquareMeterPerDay: 2, days: 7 },
  output: { waterLiters: 1400 },
} satisfies ToolExample<
  ConcreteCuringWaterNeededInput,
  ConcreteCuringWaterNeededOutput
>;

export const tool = createSimpleTool({
  id: "construction/concrete-curing-water-needed",
  title: "Concrete Curing Water Needed",
  description:
    "Estimated curing-water volume from exposed concrete area, chosen daily application rate and number of curing days.",
  inputs: [
    {
      id: "exposedSquareMeters",
      kind: "number",
      label: "Exposed Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "litersPerSquareMeterPerDay",
      kind: "number",
      label: "Liters Per Square Meter Per Day",
      unit: "L/(m²·day)",
      minimum: 0,
    },
    { id: "days", kind: "number", label: "Days", unit: "day", minimum: 0 },
  ],
  outputs: [
    { id: "waterLiters", kind: "number", label: "Water Liters", unit: "L" },
  ],
  calculate: (input) =>
    calculateConcreteCuringWaterNeeded({
      exposedSquareMeters: input.exposedSquareMeters as number,
      litersPerSquareMeterPerDay: input.litersPerSquareMeterPerDay as number,
      days: input.days as number,
    }),
});
export const concreteCuringWaterNeededTool = tool;
export const runConcreteCuringWaterNeeded = tool.execute;
export default tool;

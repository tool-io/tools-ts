import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly atmosphereKgPerM3: number;
  readonly dragCoefficient: number;
  readonly areaSquareMeters: number;
  readonly spacecraftKg: number;
  readonly relativeMetersPerSecond: number;
  readonly orbitDutyFraction: number;
  readonly intervalDays: number;
}>;
export type Output = Readonly<{
  readonly meanDragMetersPerSecondSquared: number;
  readonly makeupDeltaVMetersPerSecond: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.atmosphereKgPerM3, "atmosphereKgPerM3");
  positive(input.dragCoefficient, "dragCoefficient");
  positive(input.areaSquareMeters, "areaSquareMeters");
  positive(input.spacecraftKg, "spacecraftKg");
  nonnegative(input.relativeMetersPerSecond, "relativeMetersPerSecond");
  fraction(input.orbitDutyFraction, "orbitDutyFraction");
  nonnegative(input.intervalDays, "intervalDays");
  const meanDragMetersPerSecondSquared =
    ((0.5 *
      input.atmosphereKgPerM3 *
      input.dragCoefficient *
      input.areaSquareMeters) /
      input.spacecraftKg) *
    input.relativeMetersPerSecond ** 2 *
    input.orbitDutyFraction;
  return {
    meanDragMetersPerSecondSquared,
    makeupDeltaVMetersPerSecond:
      meanDragMetersPerSecondSquared * input.intervalDays * 86400,
  };
};
export const exampleInput = {
  atmosphereKgPerM3: 1e-5,
  dragCoefficient: 2,
  areaSquareMeters: 1,
  spacecraftKg: 10,
  relativeMetersPerSecond: 100,
  orbitDutyFraction: 0.1,
  intervalDays: 7,
} satisfies Input;
export const exampleOutput = {
  meanDragMetersPerSecondSquared: 0.001,
  makeupDeltaVMetersPerSecond: 604.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/drag-stationkeeping-impulse",
  title: "Drag Stationkeeping Impulse",
  description:
    "Estimate drag make-up impulse from a constant environment and supplied orbit duty factor; density variation and maneuver losses are not modeled.",
  inputs: [
    { id: "atmosphereKgPerM3", label: "Atmosphere kg per m 3", kind: "number" },
    { id: "dragCoefficient", label: "Drag coefficient", kind: "number" },
    { id: "areaSquareMeters", label: "Area square meters", kind: "number" },
    { id: "spacecraftKg", label: "Spacecraft kg", kind: "number" },
    {
      id: "relativeMetersPerSecond",
      label: "Relative meters per second",
      kind: "number",
    },
    { id: "orbitDutyFraction", label: "Orbit duty fraction", kind: "number" },
    { id: "intervalDays", label: "Interval days", kind: "number" },
  ],
  outputs: [
    {
      id: "meanDragMetersPerSecondSquared",
      label: "Mean drag meters per second squared",
      kind: "number",
    },
    {
      id: "makeupDeltaVMetersPerSecond",
      label: "Makeup delta v meters per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      atmosphereKgPerM3: value.atmosphereKgPerM3 as number,
      dragCoefficient: value.dragCoefficient as number,
      areaSquareMeters: value.areaSquareMeters as number,
      spacecraftKg: value.spacecraftKg as number,
      relativeMetersPerSecond: value.relativeMetersPerSecond as number,
      orbitDutyFraction: value.orbitDutyFraction as number,
      intervalDays: value.intervalDays as number,
    }),
});
export const run = tool.execute;
export default tool;

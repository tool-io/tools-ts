import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SoilBearingPressureInput = Readonly<{
  readonly verticalLoadNewtons: number;
  readonly footprintSquareMeters: number;
}>;
export type SoilBearingPressureOutput = Readonly<{
  readonly pressurePascals: number;
}>;

export const calculateSoilBearingPressure = (
  x: SoilBearingPressureInput,
): SoilBearingPressureOutput => {
  if (!Number.isFinite(x.verticalLoadNewtons) || x.verticalLoadNewtons < 0)
    simpleError("verticalLoadNewtons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.footprintSquareMeters) || x.footprintSquareMeters < 0)
    simpleError("footprintSquareMeters", "Provide a finite number at least 0.");
  const pressurePascals = x.verticalLoadNewtons / x.footprintSquareMeters;
  if (!Number.isFinite(pressurePascals))
    simpleError(
      "pressurePascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pressurePascals: Object.is(pressurePascals, -0) ? 0 : pressurePascals,
  };
};

export const example = {
  input: { verticalLoadNewtons: 100000, footprintSquareMeters: 2 },
  output: { pressurePascals: 50000 },
} satisfies ToolExample<SoilBearingPressureInput, SoilBearingPressureOutput>;

export const tool = createSimpleTool({
  id: "engineering/soil-bearing-pressure",
  title: "Soil Bearing Pressure",
  description:
    "Average contact pressure from a centered vertical load divided by foundation footprint area; no eccentricity or soil capacity check.",
  inputs: [
    {
      id: "verticalLoadNewtons",
      kind: "number",
      label: "Vertical Load Newtons",
      unit: "N",
      minimum: 0,
    },
    {
      id: "footprintSquareMeters",
      kind: "number",
      label: "Footprint Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pressurePascals",
      kind: "number",
      label: "Pressure Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateSoilBearingPressure({
      verticalLoadNewtons: input.verticalLoadNewtons as number,
      footprintSquareMeters: input.footprintSquareMeters as number,
    }),
});
export const soilBearingPressureTool = tool;
export const runSoilBearingPressure = tool.execute;
export default tool;

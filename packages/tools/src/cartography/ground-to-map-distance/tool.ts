import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GroundToMapDistanceInput = Readonly<{
  readonly groundKilometers: number;
  readonly denominator: number;
}>;
export type GroundToMapDistanceOutput = Readonly<{
  readonly mapCentimeters: number;
}>;

export const calculateGroundToMapDistance = (
  x: GroundToMapDistanceInput,
): GroundToMapDistanceOutput => {
  if (!Number.isFinite(x.groundKilometers) || x.groundKilometers < 0)
    simpleError("groundKilometers", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.denominator) || x.denominator <= 0)
    simpleError("denominator", "Provide a finite positive number.");
  const mapCentimeters = (x.groundKilometers * 100000) / x.denominator;
  if (!Number.isFinite(mapCentimeters))
    simpleError(
      "mapCentimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { mapCentimeters: Object.is(mapCentimeters, -0) ? 0 : mapCentimeters };
};

export const example = {
  input: {
    groundKilometers: 2,
    denominator: 50000,
  },
  output: { mapCentimeters: 4 },
} satisfies ToolExample<GroundToMapDistanceInput, GroundToMapDistanceOutput>;

export const tool = createSimpleTool({
  id: "cartography/ground-to-map-distance",
  title: "Ground To Map Distance",
  description:
    "Map distance in centimetres from ground kilometres and scale denominator N.",
  inputs: [
    {
      id: "groundKilometers",
      kind: "number",
      label: "Ground Kilometers",
      unit: "km",
      minimum: 0,
    },
    { id: "denominator", kind: "number", label: "Denominator", minimum: 0 },
  ],
  outputs: [
    {
      id: "mapCentimeters",
      kind: "number",
      label: "Map Centimeters",
      unit: "cm",
    },
  ],
  calculate: (input) =>
    calculateGroundToMapDistance({
      groundKilometers: input.groundKilometers as number,
      denominator: input.denominator as number,
    }),
});
export const groundToMapDistanceTool = tool;
export const runGroundToMapDistance = tool.execute;
export default tool;

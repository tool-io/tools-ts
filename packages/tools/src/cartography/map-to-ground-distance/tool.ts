import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MapToGroundDistanceInput = Readonly<{
  readonly mapCentimeters: number;
  readonly denominator: number;
}>;
export type MapToGroundDistanceOutput = Readonly<{
  readonly groundKilometers: number;
}>;

export const calculateMapToGroundDistance = (
  x: MapToGroundDistanceInput,
): MapToGroundDistanceOutput => {
  if (!Number.isFinite(x.mapCentimeters) || x.mapCentimeters < 0)
    simpleError("mapCentimeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.denominator) || x.denominator <= 0)
    simpleError("denominator", "Provide a finite positive number.");
  const groundKilometers = (x.mapCentimeters * x.denominator) / 100000;
  if (!Number.isFinite(groundKilometers))
    simpleError(
      "groundKilometers",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    groundKilometers: Object.is(groundKilometers, -0) ? 0 : groundKilometers,
  };
};

export const example = {
  input: {
    mapCentimeters: 4,
    denominator: 50000,
  },
  output: { groundKilometers: 2 },
} satisfies ToolExample<MapToGroundDistanceInput, MapToGroundDistanceOutput>;

export const tool = createSimpleTool({
  id: "cartography/map-to-ground-distance",
  title: "Map To Ground Distance",
  description:
    "Ground distance in kilometres from map distance in centimetres and scale denominator N.",
  inputs: [
    {
      id: "mapCentimeters",
      kind: "number",
      label: "Map Centimeters",
      unit: "cm",
      minimum: 0,
    },
    { id: "denominator", kind: "number", label: "Denominator", minimum: 0 },
  ],
  outputs: [
    {
      id: "groundKilometers",
      kind: "number",
      label: "Ground Kilometers",
      unit: "km",
    },
  ],
  calculate: (input) =>
    calculateMapToGroundDistance({
      mapCentimeters: input.mapCentimeters as number,
      denominator: input.denominator as number,
    }),
});
export const mapToGroundDistanceTool = tool;
export const runMapToGroundDistance = tool.execute;
export default tool;

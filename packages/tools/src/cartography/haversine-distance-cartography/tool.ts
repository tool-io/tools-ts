import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HaversineDistanceCartographyInput = Readonly<{
  readonly latitude1Degrees: number;
  readonly longitude1Degrees: number;
  readonly latitude2Degrees: number;
  readonly longitude2Degrees: number;
  readonly earthRadiusKilometers: number;
}>;
export type HaversineDistanceCartographyOutput = Readonly<{
  readonly distanceKilometers: number;
}>;

export const calculateHaversineDistanceCartography = (
  x: HaversineDistanceCartographyInput,
): HaversineDistanceCartographyOutput => {
  if (!Number.isFinite(x.latitude1Degrees))
    simpleError("latitude1Degrees", "Provide a finite number.");
  if (!Number.isFinite(x.longitude1Degrees))
    simpleError("longitude1Degrees", "Provide a finite number.");
  if (!Number.isFinite(x.latitude2Degrees))
    simpleError("latitude2Degrees", "Provide a finite number.");
  if (!Number.isFinite(x.longitude2Degrees))
    simpleError("longitude2Degrees", "Provide a finite number.");
  if (!Number.isFinite(x.earthRadiusKilometers) || x.earthRadiusKilometers <= 0)
    simpleError("earthRadiusKilometers", "Provide a finite positive number.");
  if (!(
    Math.abs(x.latitude1Degrees) <= 90 &&
    Math.abs(x.latitude2Degrees) <= 90 &&
    Math.abs(x.longitude1Degrees) <= 180 &&
    Math.abs(x.longitude2Degrees) <= 180
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const distanceKilometers =
    2 *
    x.earthRadiusKilometers *
    Math.asin(
      Math.min(
        1,
        Math.sqrt(
          Math.sin(
            ((x.latitude2Degrees - x.latitude1Degrees) * Math.PI) / 360,
          ) **
            2 +
            Math.cos((x.latitude1Degrees * Math.PI) / 180) *
              Math.cos((x.latitude2Degrees * Math.PI) / 180) *
              Math.sin(
                ((x.longitude2Degrees - x.longitude1Degrees) * Math.PI) / 360,
              ) **
                2,
        ),
      ),
    );
  if (!Number.isFinite(distanceKilometers))
    simpleError(
      "distanceKilometers",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    distanceKilometers: Object.is(distanceKilometers, -0)
      ? 0
      : distanceKilometers,
  };
};

export const example = {
  input: {
    latitude1Degrees: 0,
    longitude1Degrees: 0,
    latitude2Degrees: 0,
    longitude2Degrees: 1,
    earthRadiusKilometers: 6371.0088,
  },
  output: { distanceKilometers: 111.1950802335329 },
} satisfies ToolExample<
  HaversineDistanceCartographyInput,
  HaversineDistanceCartographyOutput
>;

export const tool = createSimpleTool({
  id: "cartography/haversine-distance-cartography",
  title: "Haversine Distance Cartography",
  description:
    "Spherical great-circle distance in kilometres using a user-supplied Earth radius.",
  inputs: [
    {
      id: "latitude1Degrees",
      kind: "number",
      label: "Latitude1Degrees",
      unit: "deg",
    },
    {
      id: "longitude1Degrees",
      kind: "number",
      label: "Longitude1Degrees",
      unit: "deg",
    },
    {
      id: "latitude2Degrees",
      kind: "number",
      label: "Latitude2Degrees",
      unit: "deg",
    },
    {
      id: "longitude2Degrees",
      kind: "number",
      label: "Longitude2Degrees",
      unit: "deg",
    },
    {
      id: "earthRadiusKilometers",
      kind: "number",
      label: "Earth Radius Kilometers",
      unit: "km",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "distanceKilometers",
      kind: "number",
      label: "Distance Kilometers",
      unit: "km",
    },
  ],
  calculate: (input) =>
    calculateHaversineDistanceCartography({
      latitude1Degrees: input.latitude1Degrees as number,
      longitude1Degrees: input.longitude1Degrees as number,
      latitude2Degrees: input.latitude2Degrees as number,
      longitude2Degrees: input.longitude2Degrees as number,
      earthRadiusKilometers: input.earthRadiusKilometers as number,
    }),
});
export const haversineDistanceCartographyTool = tool;
export const runHaversineDistanceCartography = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LongitudeDegreeToKmDepartureInput = Readonly<{
  readonly latitudeDegrees: number;
  readonly earthRadiusKilometers: number;
}>;
export type LongitudeDegreeToKmDepartureOutput = Readonly<{
  readonly kilometersPerLongitudeDegree: number;
}>;

export const calculateLongitudeDegreeToKmDeparture = (
  x: LongitudeDegreeToKmDepartureInput,
): LongitudeDegreeToKmDepartureOutput => {
  if (!Number.isFinite(x.latitudeDegrees))
    simpleError("latitudeDegrees", "Provide a finite number.");
  if (!Number.isFinite(x.earthRadiusKilometers) || x.earthRadiusKilometers <= 0)
    simpleError("earthRadiusKilometers", "Provide a finite positive number.");
  if (!(Math.abs(x.latitudeDegrees) <= 90))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const kilometersPerLongitudeDegree =
    (Math.PI *
      x.earthRadiusKilometers *
      Math.cos((x.latitudeDegrees * Math.PI) / 180)) /
    180;
  if (!Number.isFinite(kilometersPerLongitudeDegree))
    simpleError(
      "kilometersPerLongitudeDegree",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    kilometersPerLongitudeDegree: Object.is(kilometersPerLongitudeDegree, -0)
      ? 0
      : kilometersPerLongitudeDegree,
  };
};

export const example = {
  input: {
    latitudeDegrees: 0,
    earthRadiusKilometers: 6371.0088,
  },
  output: { kilometersPerLongitudeDegree: 111.1950802335329 },
} satisfies ToolExample<
  LongitudeDegreeToKmDepartureInput,
  LongitudeDegreeToKmDepartureOutput
>;

export const tool = createSimpleTool({
  id: "cartography/longitude-degree-to-km-departure",
  title: "Longitude Degree To Km Departure",
  description:
    "Approximate east-west kilometres per longitude degree at latitude on a spherical Earth.",
  inputs: [
    {
      id: "latitudeDegrees",
      kind: "number",
      label: "Latitude Degrees",
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
      id: "kilometersPerLongitudeDegree",
      kind: "number",
      label: "Kilometers Per Longitude Degree",
      unit: "km/deg",
    },
  ],
  calculate: (input) =>
    calculateLongitudeDegreeToKmDeparture({
      latitudeDegrees: input.latitudeDegrees as number,
      earthRadiusKilometers: input.earthRadiusKilometers as number,
    }),
});
export const longitudeDegreeToKmDepartureTool = tool;
export const runLongitudeDegreeToKmDeparture = tool.execute;
export default tool;

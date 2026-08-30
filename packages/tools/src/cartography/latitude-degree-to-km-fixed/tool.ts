import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LatitudeDegreeToKmFixedInput = Readonly<{
  readonly earthRadiusKilometers: number;
}>;
export type LatitudeDegreeToKmFixedOutput = Readonly<{
  readonly kilometersPerLatitudeDegree: number;
}>;

export const calculateLatitudeDegreeToKmFixed = (
  x: LatitudeDegreeToKmFixedInput,
): LatitudeDegreeToKmFixedOutput => {
  if (!Number.isFinite(x.earthRadiusKilometers) || x.earthRadiusKilometers <= 0)
    simpleError("earthRadiusKilometers", "Provide a finite positive number.");
  const kilometersPerLatitudeDegree = (Math.PI * x.earthRadiusKilometers) / 180;
  if (!Number.isFinite(kilometersPerLatitudeDegree))
    simpleError(
      "kilometersPerLatitudeDegree",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    kilometersPerLatitudeDegree: Object.is(kilometersPerLatitudeDegree, -0)
      ? 0
      : kilometersPerLatitudeDegree,
  };
};

export const example = {
  input: {
    earthRadiusKilometers: 6371.0088,
  },
  output: { kilometersPerLatitudeDegree: 111.1950802335329 },
} satisfies ToolExample<
  LatitudeDegreeToKmFixedInput,
  LatitudeDegreeToKmFixedOutput
>;

export const tool = createSimpleTool({
  id: "cartography/latitude-degree-to-km-fixed",
  title: "Latitude Degree To Km Fixed",
  description:
    "Approximate north-south kilometres per latitude degree on a spherical Earth.",
  inputs: [
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
      id: "kilometersPerLatitudeDegree",
      kind: "number",
      label: "Kilometers Per Latitude Degree",
      unit: "km/deg",
    },
  ],
  calculate: (input) =>
    calculateLatitudeDegreeToKmFixed({
      earthRadiusKilometers: input.earthRadiusKilometers as number,
    }),
});
export const latitudeDegreeToKmFixedTool = tool;
export const runLatitudeDegreeToKmFixed = tool.execute;
export default tool;

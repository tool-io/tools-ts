import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HorizonDistanceFromHeightInput = Readonly<{
  readonly heightMeters: number;
  readonly earthRadiusKilometers: number;
}>;
export type HorizonDistanceFromHeightOutput = Readonly<{
  readonly horizonKilometers: number;
}>;

export const calculateHorizonDistanceFromHeight = (
  x: HorizonDistanceFromHeightInput,
): HorizonDistanceFromHeightOutput => {
  if (!Number.isFinite(x.heightMeters) || x.heightMeters < 0)
    simpleError("heightMeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.earthRadiusKilometers) || x.earthRadiusKilometers <= 0)
    simpleError("earthRadiusKilometers", "Provide a finite positive number.");
  const horizonKilometers = Math.sqrt(
    (x.earthRadiusKilometers + x.heightMeters / 1000) ** 2 -
      x.earthRadiusKilometers ** 2,
  );
  if (!Number.isFinite(horizonKilometers))
    simpleError(
      "horizonKilometers",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    horizonKilometers: Object.is(horizonKilometers, -0) ? 0 : horizonKilometers,
  };
};

export const example = {
  input: {
    heightMeters: 2,
    earthRadiusKilometers: 6371.0088,
  },
  output: { horizonKilometers: 5.048171867352824 },
} satisfies ToolExample<
  HorizonDistanceFromHeightInput,
  HorizonDistanceFromHeightOutput
>;

export const tool = createSimpleTool({
  id: "cartography/horizon-distance-from-height",
  title: "Horizon Distance From Height",
  description:
    "Geometric horizon distance in kilometres for observer height and spherical Earth radius, without refraction.",
  inputs: [
    {
      id: "heightMeters",
      kind: "number",
      label: "Height Meters",
      unit: "m",
      minimum: 0,
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
      id: "horizonKilometers",
      kind: "number",
      label: "Horizon Kilometers",
      unit: "km",
    },
  ],
  calculate: (input) =>
    calculateHorizonDistanceFromHeight({
      heightMeters: input.heightMeters as number,
      earthRadiusKilometers: input.earthRadiusKilometers as number,
    }),
});
export const horizonDistanceFromHeightTool = tool;
export const runHorizonDistanceFromHeight = tool.execute;
export default tool;

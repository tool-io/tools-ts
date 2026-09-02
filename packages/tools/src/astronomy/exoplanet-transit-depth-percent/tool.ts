import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly planetRadiusSameUnits: number;
  readonly starRadiusSameUnits: number;
}>;
export type Output = Readonly<{
  readonly uniformDiskTransitDepthPercent: number;
}>;
const inputFields = [
  {
    id: "planetRadiusSameUnits",
    label: "Planet radius same units",
    kind: "number",
  },
  {
    id: "starRadiusSameUnits",
    label: "Star radius same units",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.starRadiusSameUnits, "starRadiusSameUnits");
  nonnegative(input.planetRadiusSameUnits, "planetRadiusSameUnits");
  if (input.planetRadiusSameUnits > input.starRadiusSameUnits)
    simpleError("radius", "Planet≤star under small opaque transit model.");
  return {
    uniformDiskTransitDepthPercent:
      100 * (input.planetRadiusSameUnits / input.starRadiusSameUnits) ** 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  planetRadiusSameUnits: 1,
  starRadiusSameUnits: 10,
} satisfies Input;
export const exampleOutput = {
  uniformDiskTransitDepthPercent: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/exoplanet-transit-depth-percent",
  title: "Exoplanet Transit Depth Percent",
  description:
    "Unblended fully contained opaque planet across uniformly bright stellar disk; grazing, limb darkening and dilution external. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "uniformDiskTransitDepthPercent",
      label: "Uniform disk transit depth percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      planetRadiusSameUnits: value.planetRadiusSameUnits as number,
      starRadiusSameUnits: value.starRadiusSameUnits as number,
    }),
});
export const run = tool.execute;
export default tool;

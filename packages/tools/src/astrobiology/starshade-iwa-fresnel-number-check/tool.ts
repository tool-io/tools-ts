import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly starshadeRadiusMeters: number;
  readonly starshadeDistanceMeters: number;
  readonly observedWavelengthMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "starshadeRadiusMeters",
    label: "Starshade radius meters",
    kind: "number",
  },
  {
    id: "starshadeDistanceMeters",
    label: "Starshade distance meters",
    kind: "number",
  },
  {
    id: "observedWavelengthMeters",
    label: "Observed wavelength meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.starshadeRadiusMeters, "radius");
  positive(input.starshadeDistanceMeters, "distance");
  positive(input.observedWavelengthMeters, "wavelength");
  return {
    conditionalGeometricIwaRadians:
      input.starshadeRadiusMeters / input.starshadeDistanceMeters,
    conditionalRadiusFresnelNumber:
      input.starshadeRadiusMeters ** 2 /
      (input.observedWavelengthMeters * input.starshadeDistanceMeters),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    starshadeRadiusMeters: 10,
    starshadeDistanceMeters: 100000000,
    observedWavelengthMeters: 5e-7,
  },
  output: {
    result: {
      conditionalGeometricIwaRadians: 1e-7,
      conditionalRadiusFresnelNumber: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/starshade-iwa-fresnel-number-check",
  title: "Starshade IWA Fresnel Number Geometry Check",
  description:
    "Ideal small-angle starshade radius/distance and radius-convention Fresnel numberR\u00b2/(\u03bbz), not aperture-diameter convention, actual suppression, IWAperformance or flight-design validation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

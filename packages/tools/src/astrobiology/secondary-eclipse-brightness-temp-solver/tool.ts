import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly starTemperatureK: number;
  readonly wavelengthM: number;
  readonly planetToStarRadius: number;
  readonly eclipseDepthFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "starTemperatureK", label: "Star temperature k", kind: "number" },
  { id: "wavelengthM", label: "Wavelength m", kind: "number" },
  { id: "planetToStarRadius", label: "Planet to star radius", kind: "number" },
  {
    id: "eclipseDepthFraction",
    label: "Eclipse depth fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.starTemperatureK, "star temperature");
  positive(i.wavelengthM, "wavelength");
  positive(i.planetToStarRadius, "radius ratio");
  fraction(i.planetToStarRadius, "radius ratio");
  positive(i.eclipseDepthFraction, "depth");
  fraction(i.eclipseDepthFraction, "depth");
  if (0.014387768775039337 / (i.wavelengthM * i.starTemperatureK) > 600)
    simpleError("domain", "Bounded Planck exponent <=600.");
  return {
    monochromaticBrightnessTemperatureK:
      0.014387768775039337 /
      (i.wavelengthM *
        Math.log1p(
          (Math.expm1(
            0.014387768775039337 / (i.wavelengthM * i.starTemperatureK),
          ) *
            i.planetToStarRadius ** 2) /
            i.eclipseDepthFraction,
        )),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    starTemperatureK: 1000,
    wavelengthM: 1.4387768775039337e-5,
    planetToStarRadius: 0.1,
    eclipseDepthFraction: 0.01,
  },
  output: { result: { monochromaticBrightnessTemperatureK: 1000 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/secondary-eclipse-brightness-temp-solver",
  title: "Secondary Eclipse Planet Brightness Temperature Solver",
  description:
    "Monochromatic blackbody brightness temperature from planet/star eclipse flux ratio; stellar spectrum, passband integration/reflection and limb effects omitted.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

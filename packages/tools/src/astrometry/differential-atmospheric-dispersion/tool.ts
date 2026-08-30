import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { rad, deg } from "../shared.js";

export type Input = Readonly<{
  readonly firstRefractiveIndex: number;
  readonly secondRefractiveIndex: number;
  readonly zenithDistanceDegrees: number;
}>;
export type Output = Readonly<{
  readonly dispersionArcseconds: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.firstRefractiveIndex < 1 ||
    input.firstRefractiveIndex > 1.01 ||
    input.secondRefractiveIndex < 1 ||
    input.secondRefractiveIndex > 1.01 ||
    input.zenithDistanceDegrees < 0 ||
    input.zenithDistanceDegrees > 85
  )
    simpleError(
      "zenithDistanceDegrees",
      "Dilute atmospheric indices in [1,1.01] and zenith distance in [0,85] degrees required.",
    );
  return {
    dispersionArcseconds:
      deg(
        (input.firstRefractiveIndex - input.secondRefractiveIndex) *
          Math.tan(rad(input.zenithDistanceDegrees)),
      ) * 3600,
  };
};
export const exampleInput = {
  firstRefractiveIndex: 1.0003,
  secondRefractiveIndex: 1.0002,
  zenithDistanceDegrees: 45,
} satisfies Input;
export const exampleOutput = {
  dispersionArcseconds: 20.626480624707362,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/differential-atmospheric-dispersion",
  title: "Differential Atmospheric Dispersion",
  description:
    "Compute signed first-order atmospheric differential refraction from caller-supplied wavelength-dependent indices at actual conditions; near-horizon curvature is excluded.",
  inputs: [
    {
      id: "firstRefractiveIndex",
      label: "First refractive index",
      kind: "number",
    },
    {
      id: "secondRefractiveIndex",
      label: "Second refractive index",
      kind: "number",
    },
    {
      id: "zenithDistanceDegrees",
      label: "Zenith distance degrees",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "dispersionArcseconds",
      label: "Dispersion arcseconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstRefractiveIndex: value.firstRefractiveIndex as number,
      secondRefractiveIndex: value.secondRefractiveIndex as number,
      zenithDistanceDegrees: value.zenithDistanceDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;

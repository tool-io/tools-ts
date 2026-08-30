import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, rad } from "../shared.js";

export type Input = Readonly<{
  readonly separationArcseconds: number;
  readonly distanceParsecs: number;
}>;
export type Output = Readonly<{
  readonly projectedSeparationAu: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.separationArcseconds, "separationArcseconds");
  positive(input.distanceParsecs, "distanceParsecs");
  if (input.separationArcseconds >= 90 * 3600)
    simpleError(
      "separationArcseconds",
      "Projected small-field separation must be below 90 degrees.",
    );
  return {
    projectedSeparationAu:
      (Math.tan(rad(input.separationArcseconds / 3600)) *
        input.distanceParsecs *
        648000) /
      Math.PI,
  };
};
export const exampleInput = {
  separationArcseconds: 0.01,
  distanceParsecs: 10,
} satisfies Input;
export const exampleOutput = {
  projectedSeparationAu: 0.10000000000000009,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/angular-projected-binary-separation",
  title: "Angular Projected Binary Separation",
  description:
    "Convert angular binary separation and distance to a tangent-plane projected separation in AU; this is not a deprojected semimajor axis.",
  inputs: [
    {
      id: "separationArcseconds",
      label: "Separation arcseconds",
      kind: "number",
    },
    { id: "distanceParsecs", label: "Distance parsecs", kind: "number" },
  ],
  outputs: [
    {
      id: "projectedSeparationAu",
      label: "Projected separation au",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      separationArcseconds: value.separationArcseconds as number,
      distanceParsecs: value.distanceParsecs as number,
    }),
});
export const run = tool.execute;
export default tool;

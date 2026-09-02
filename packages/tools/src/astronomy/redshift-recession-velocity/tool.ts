import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly specialRelativisticRadialRedshift: number;
}>;
export type Output = Readonly<{
  readonly radialBeta: number;
  readonly radialVelocityKmPerSecond: number;
}>;
const inputFields = [
  {
    id: "specialRelativisticRadialRedshift",
    label: "Special relativistic radial redshift",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.specialRelativisticRadialRedshift <= -1 ||
    input.specialRelativisticRadialRedshift > 1e4
  )
    simpleError("z", "−1<z≤10000bounded radialSRmodel.");
  return {
    radialBeta:
      ((1 + input.specialRelativisticRadialRedshift) ** 2 - 1) /
      ((1 + input.specialRelativisticRadialRedshift) ** 2 + 1),
    radialVelocityKmPerSecond:
      (299792.458 * ((1 + input.specialRelativisticRadialRedshift) ** 2 - 1)) /
      ((1 + input.specialRelativisticRadialRedshift) ** 2 + 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  specialRelativisticRadialRedshift: 1,
} satisfies Input;
export const exampleOutput = {
  radialBeta: 0.6,
  radialVelocityKmPerSecond: 179875.4748,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/redshift-recession-velocity",
  title: "Redshift to Recession Velocity Converter",
  description:
    "Pure radial special-relativistic Doppler redshift inversion, supports blue shift z>−1; cosmological redshift not a unique SR velocity. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "radialBeta", label: "Radial beta", kind: "number" },
    {
      id: "radialVelocityKmPerSecond",
      label: "Radial velocity km per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      specialRelativisticRadialRedshift:
        value.specialRelativisticRadialRedshift as number,
    }),
});
export const run = tool.execute;
export default tool;

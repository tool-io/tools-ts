import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly massKg: number;
  readonly callerFluxMeanOpacityM2PerKg: number;
}>;
export type Output = Readonly<{
  readonly idealEddingtonLuminosityWatts: number;
}>;
const inputFields = [
  { id: "massKg", label: "Mass kg", kind: "number" },
  {
    id: "callerFluxMeanOpacityM2PerKg",
    label: "Caller flux mean opacity m2 per kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerFluxMeanOpacityM2PerKg, "callerFluxMeanOpacityM2PerKg");
  nonnegative(input.massKg, "massKg");
  return {
    idealEddingtonLuminosityWatts:
      (4 * Math.PI * 6.6743e-11 * 299792458 * input.massKg) /
      input.callerFluxMeanOpacityM2PerKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  massKg: 1,
  callerFluxMeanOpacityM2PerKg: 1,
} satisfies Input;
export const exampleOutput = {
  idealEddingtonLuminosityWatts: 0.2514411131137896,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/eddington-luminosity-limit",
  title: "Eddington Luminosity Limit Calculator",
  description:
    "Spherical radiative force/gravity balance 4πGMc/κwith independent applicable flux-mean opacity; not hydrogen-only fixed luminosity or actual accretion ceiling. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealEddingtonLuminosityWatts",
      label: "Ideal eddington luminosity watts",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      massKg: value.massKg as number,
      callerFluxMeanOpacityM2PerKg:
        value.callerFluxMeanOpacityM2PerKg as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  points,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedGlassComplexRelativePermittivity: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly observedGlassLossTangents: readonly number[];
}>;
const inputFields = [
  {
    id: "observedGlassComplexRelativePermittivity",
    label: "Observed glass complex relative permittivity",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  points(input.observedGlassComplexRelativePermittivity);
  input.observedGlassComplexRelativePermittivity.forEach((r) => {
    positive(r[0], "real permittivity");
    nonnegative(r[1], "positive loss convention");
  });
  return {
    observedGlassLossTangents:
      input.observedGlassComplexRelativePermittivity.map((r) => r[1] / r[0]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGlassComplexRelativePermittivity: [
    [4, 0.2],
    [2, 0.3],
  ],
} satisfies Input;
export const exampleOutput = {
  observedGlassLossTangents: [0.05, 0.15],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/glass-interposer-loss-tangent",
  title: "Semiconductor Glass Interposer Loss Tangent Calculator",
  description:
    "Audit measured glass dielectric complex ε under explicit positive-loss convention tanδ=εloss/εreal; not refractive complex contrast or generic capacitance dielectric constant.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedGlassLossTangents",
      label: "Observed glass loss tangents",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGlassComplexRelativePermittivity:
        value.observedGlassComplexRelativePermittivity as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;

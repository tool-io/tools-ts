import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly wavelengthM: number;
  readonly depthM: number;
  readonly gravityMPerS2: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "wavelengthM", label: "Wavelength m", kind: "number" },
  { id: "depthM", label: "Depth m", kind: "number" },
  { id: "gravityMPerS2", label: "Gravity m per s2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.wavelengthM, "wavelength");
  positive(i.depthM, "depth");
  positive(i.gravityMPerS2, "gravity");
  return {
    phaseSpeedMPerS: Math.sqrt(
      (i.gravityMPerS2 * Math.tanh((2 * Math.PI * i.depthM) / i.wavelengthM)) /
        ((2 * Math.PI) / i.wavelengthM),
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { wavelengthM: 6.283185307179586, depthM: 1, gravityMPerS2: 1 },
  output: { result: { phaseSpeedMPerS: 0.8726936208978296 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/shallow-water-wave-celerity-transition",
  title: "Shallow Water Wave Celerity Transition Calculator",
  description:
    "Linear finite-depth dispersion c=sqrt(g tanh(kh)/k) bridging shallow/deep limits; no nonlinear shoaling model.",
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

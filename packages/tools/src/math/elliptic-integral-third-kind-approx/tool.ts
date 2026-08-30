import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, simpson } from "../batch-shared.js";
export type Input = Readonly<{
  readonly ellipticParameterM: number;
  readonly simpsonPanels: number;
  readonly characteristicN: number;
}>;
export type Output = Readonly<{ readonly completeEllipticIntegral: number }>;
const inputFields = [
  { id: "ellipticParameterM", label: "Elliptic parameter m", kind: "number" },
  { id: "simpsonPanels", label: "Simpson panels", kind: "number" },
  { id: "characteristicN", label: "Characteristic n", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.ellipticParameterM < 0 || input.ellipticParameterM >= 1)
    simpleError(
      "m",
      "Complete real integral parameter m=k² in [0,1) required.",
    );
  if (input.characteristicN >= 1 || Math.abs(input.characteristicN) > 100)
    simpleError("n", "Characteristic n<1 and |n|≤100 required.");
  return {
    completeEllipticIntegral: simpson(
      (t) =>
        1 /
        ((1 - input.characteristicN * Math.sin(t) ** 2) *
          Math.sqrt(1 - input.ellipticParameterM * Math.sin(t) ** 2)),
      0,
      Math.PI / 2,
      input.simpsonPanels,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ellipticParameterM: 0,
  simpsonPanels: 100,
  characteristicN: 0.5,
} satisfies Input;
export const exampleOutput = {
  completeEllipticIntegral: 2.221441469079183,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/elliptic-integral-third-kind-approx",
  title: "Elliptic Integral Third Kind Approximation",
  description:
    "Approximate complete real elliptic integral of the third kind on [0,π/2] with caller even-panel Simpson rule; parameter m=k² explicitly differs from modulus k, no hidden error guarantee near singular m=1 or characteristic n=1.",
  inputs: inputFields,
  outputs: [
    {
      id: "completeEllipticIntegral",
      label: "Complete elliptic integral",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      ellipticParameterM: value.ellipticParameterM as number,
      simpsonPanels: value.simpsonPanels as number,
      characteristicN: value.characteristicN as number,
    }),
});
export const run = tool.execute;
export default tool;

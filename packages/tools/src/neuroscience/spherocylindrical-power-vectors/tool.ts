import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";
export type Input = Readonly<{
  readonly sphereDiopters: number;
  readonly cylinderDiopters: number;
  readonly axisDegrees: number;
}>;
export type Output = Readonly<{
  readonly sphericalEquivalentDiopters: number;
  readonly j0Diopters: number;
  readonly j45Diopters: number;
}>;
const inputFields = [
  { id: "sphereDiopters", label: "Sphere diopters", kind: "number" },
  { id: "cylinderDiopters", label: "Cylinder diopters", kind: "number" },
  { id: "axisDegrees", label: "Axis degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.axisDegrees < 0 || input.axisDegrees >= 180)
    simpleError("axisDegrees", "Cylinder axis must lie in [0,180) degrees.");
  const a = (input.axisDegrees * Math.PI) / 90;
  return {
    sphericalEquivalentDiopters:
      input.sphereDiopters + input.cylinderDiopters / 2,
    j0Diopters: (-input.cylinderDiopters / 2) * Math.cos(a),
    j45Diopters: (-input.cylinderDiopters / 2) * Math.sin(a),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sphereDiopters: -2,
  cylinderDiopters: -1,
  axisDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  sphericalEquivalentDiopters: -2.5,
  j0Diopters: 0.5,
  j45Diopters: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/spherocylindrical-power-vectors",
  title: "Spherical Equivalent Refraction",
  description:
    "Convert a signed sphere/cylinder prescription into spherical equivalent and J0/J45 power vectors; plus- and minus-cylinder prescriptions are both accepted.",
  inputs: inputFields,
  outputs: [
    {
      id: "sphericalEquivalentDiopters",
      label: "Spherical equivalent diopters",
      kind: "number",
    },
    { id: "j0Diopters", label: "J0 diopters", kind: "number" },
    { id: "j45Diopters", label: "J45 diopters", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sphereDiopters: value.sphereDiopters as number,
      cylinderDiopters: value.cylinderDiopters as number,
      axisDegrees: value.axisDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;

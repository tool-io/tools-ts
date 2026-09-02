import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly telescopeFocalMm: number;
  readonly eyepieceFocalMm: number;
}>;
export type Output = Readonly<{ readonly angularMagnification: number }>;
const inputFields = [
  { id: "telescopeFocalMm", label: "Telescope focal mm", kind: "number" },
  { id: "eyepieceFocalMm", label: "Eyepiece focal mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.telescopeFocalMm, "telescopeFocalMm");
  positive(input.eyepieceFocalMm, "eyepieceFocalMm");
  return {
    angularMagnification: input.telescopeFocalMm / input.eyepieceFocalMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  telescopeFocalMm: 1000,
  eyepieceFocalMm: 20,
} satisfies Input;
export const exampleOutput = { angularMagnification: 50 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/telescope-magnification-focal-lengths",
  title: "Telescope Magnification From Focal Lengths",
  description:
    "Ideal visual telescope angular magnification from focal-length ratio, no usable-image or seeing guarantee. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "angularMagnification",
      label: "Angular magnification",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      telescopeFocalMm: value.telescopeFocalMm as number,
      eyepieceFocalMm: value.eyepieceFocalMm as number,
    }),
});
export const run = tool.execute;
export default tool;

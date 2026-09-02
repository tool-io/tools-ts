import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly apertureDiameterMm: number;
  readonly angularMagnification: number;
}>;
export type Output = Readonly<{ readonly exitPupilDiameterMm: number }>;
const inputFields = [
  { id: "apertureDiameterMm", label: "Aperture diameter mm", kind: "number" },
  {
    id: "angularMagnification",
    label: "Angular magnification",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.apertureDiameterMm, "apertureDiameterMm");
  positive(input.angularMagnification, "angularMagnification");
  return {
    exitPupilDiameterMm: input.apertureDiameterMm / input.angularMagnification,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  apertureDiameterMm: 100,
  angularMagnification: 50,
} satisfies Input;
export const exampleOutput = { exitPupilDiameterMm: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/eyepiece-exit-pupil-mm",
  title: "Eyepiece Exit Pupil mm Calculator",
  description:
    "Ideal visual telescope exit-pupil aperture/magnification; eye clipping and actual field illumination excluded. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "exitPupilDiameterMm",
      label: "Exit pupil diameter mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      apertureDiameterMm: value.apertureDiameterMm as number,
      angularMagnification: value.angularMagnification as number,
    }),
});
export const run = tool.execute;
export default tool;

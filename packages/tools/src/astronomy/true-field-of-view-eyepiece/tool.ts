import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  deg,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly eyepieceFieldStopMm: number;
  readonly telescopeFocalMm: number;
}>;
export type Output = Readonly<{ readonly fieldStopTrueFieldDegrees: number }>;
const inputFields = [
  {
    id: "eyepieceFieldStopMm",
    label: "Eyepiece field stop mm",
    kind: "number",
  },
  { id: "telescopeFocalMm", label: "Telescope focal mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.telescopeFocalMm, "telescopeFocalMm");
  nonnegative(input.eyepieceFieldStopMm, "eyepieceFieldStopMm");
  return {
    fieldStopTrueFieldDegrees:
      2 *
      deg(Math.atan(input.eyepieceFieldStopMm / (2 * input.telescopeFocalMm))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eyepieceFieldStopMm: 20,
  telescopeFocalMm: 1000,
} satisfies Input;
export const exampleOutput = {
  fieldStopTrueFieldDegrees: 1.1458773953669719,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/true-field-of-view-eyepiece",
  title: "True Field of View Eyepiece Calculator",
  description:
    "Rectilinear field-stop true-field angle, not approximate apparent-field/magnification under unknown eyepiece distortion. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "fieldStopTrueFieldDegrees",
      label: "Field stop true field degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eyepieceFieldStopMm: value.eyepieceFieldStopMm as number,
      telescopeFocalMm: value.telescopeFocalMm as number,
    }),
});
export const run = tool.execute;
export default tool;

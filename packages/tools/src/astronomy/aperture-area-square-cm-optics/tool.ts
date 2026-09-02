import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly apertureMm: number;
  readonly obstructionMm: number;
}>;
export type Output = Readonly<{ readonly clearApertureAreaCM2: number }>;
const inputFields = [
  { id: "apertureMm", label: "Aperture mm", kind: "number" },
  { id: "obstructionMm", label: "Obstruction mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.apertureMm, "apertureMm");
  nonnegative(input.obstructionMm, "obstructionMm");
  if (input.obstructionMm >= input.apertureMm)
    simpleError("obstruction", "Positive clear pupil.");
  return {
    clearApertureAreaCM2:
      (Math.PI * (input.apertureMm ** 2 - input.obstructionMm ** 2)) / 400,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  apertureMm: 100,
  obstructionMm: 20,
} satisfies Input;
export const exampleOutput = {
  clearApertureAreaCM2: 75.39822368615503,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/aperture-area-square-cm-optics",
  title: "Aperture Area cm² Optics Calculator",
  description:
    "Measured unobscured annular pupil area in cm², not nominal filled disk or eye-normalized throughput. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "clearApertureAreaCM2",
      label: "Clear aperture area c m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      apertureMm: value.apertureMm as number,
      obstructionMm: value.obstructionMm as number,
    }),
});
export const run = tool.execute;
export default tool;

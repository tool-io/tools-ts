import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, rad } from "../batch41-shared.js";
export type Input = Readonly<{ readonly zenithAngleDegrees: number }>;
export type Output = Readonly<{ readonly planeParallelAirmass: number }>;
const inputFields = [
  { id: "zenithAngleDegrees", label: "Zenith angle degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.zenithAngleDegrees < 0 || input.zenithAngleDegrees > 75)
    simpleError("zenith", "Bounded 0..75°plane-parallel domain.");
  return { planeParallelAirmass: 1 / Math.cos(rad(input.zenithAngleDegrees)) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { zenithAngleDegrees: 60 } satisfies Input;
export const exampleOutput = { planeParallelAirmass: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/airmass-planeparallel-approximation-calculator",
  title: "Air Mass sec(z) Plane-Parallel Approximation Calculator",
  description:
    "Named plane-parallel sec(z) relative airmass bounded 0..75°, not near-horizon curved-atmosphere Kasten Young. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "planeParallelAirmass",
      label: "Plane parallel airmass",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ zenithAngleDegrees: value.zenithAngleDegrees as number }),
});
export const run = tool.execute;
export default tool;

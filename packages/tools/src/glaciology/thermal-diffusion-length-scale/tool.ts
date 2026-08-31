import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly thermalDiffusivityM2Second: number;
  readonly elapsedSeconds: number;
  readonly callerDiffusionLengthMultiplier: number;
}>;
export type Output = Readonly<{ readonly diffusionLengthM: number }>;
const inputFields = [
  {
    id: "thermalDiffusivityM2Second",
    label: "Thermal diffusivity m2 second",
    kind: "number",
  },
  { id: "elapsedSeconds", label: "Elapsed seconds", kind: "number" },
  {
    id: "callerDiffusionLengthMultiplier",
    label: "Caller diffusion length multiplier",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.thermalDiffusivityM2Second, "thermalDiffusivityM2Second");
  positive(
    input.callerDiffusionLengthMultiplier,
    "callerDiffusionLengthMultiplier",
  );
  nonnegative(input.elapsedSeconds, "elapsedSeconds");
  return {
    diffusionLengthM:
      input.callerDiffusionLengthMultiplier *
      Math.sqrt(input.thermalDiffusivityM2Second * input.elapsedSeconds),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  thermalDiffusivityM2Second: 1e-6,
  elapsedSeconds: 1000000.0,
  callerDiffusionLengthMultiplier: 2,
} satisfies Input;
export const exampleOutput = { diffusionLengthM: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/thermal-diffusion-length-scale",
  title: "Thermal Diffusion Length Scale Calculator",
  description:
    "Evaluate caller diffusion-length convention multiplier times sqrt(kappa*t); not exact thermal-front depth or transient boundary-condition solution.",
  inputs: inputFields,
  outputs: [
    { id: "diffusionLengthM", label: "Diffusion length m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      thermalDiffusivityM2Second: value.thermalDiffusivityM2Second as number,
      elapsedSeconds: value.elapsedSeconds as number,
      callerDiffusionLengthMultiplier:
        value.callerDiffusionLengthMultiplier as number,
    }),
});
export const run = tool.execute;
export default tool;

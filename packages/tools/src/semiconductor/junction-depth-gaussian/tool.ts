import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerSurfaceDopantPerM3: number;
  readonly callerBackgroundDopantPerM3: number;
  readonly callerDiffusivityM2Second: number;
  readonly callerElapsedSeconds: number;
}>;
export type Output = Readonly<{
  readonly modeledGaussianJunctionDepthM: number;
}>;
const inputFields = [
  {
    id: "callerSurfaceDopantPerM3",
    label: "Caller surface dopant per m3",
    kind: "number",
  },
  {
    id: "callerBackgroundDopantPerM3",
    label: "Caller background dopant per m3",
    kind: "number",
  },
  {
    id: "callerDiffusivityM2Second",
    label: "Caller diffusivity m2 second",
    kind: "number",
  },
  {
    id: "callerElapsedSeconds",
    label: "Caller elapsed seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerSurfaceDopantPerM3, "callerSurfaceDopantPerM3");
  positive(input.callerBackgroundDopantPerM3, "callerBackgroundDopantPerM3");
  positive(input.callerDiffusivityM2Second, "callerDiffusivityM2Second");
  positive(input.callerElapsedSeconds, "callerElapsedSeconds");
  if (input.callerSurfaceDopantPerM3 <= input.callerBackgroundDopantPerM3)
    simpleError(
      "concentrations",
      "Surface above background required on this Gaussian branch.",
    );
  return {
    modeledGaussianJunctionDepthM:
      2 *
      Math.sqrt(
        input.callerDiffusivityM2Second *
          input.callerElapsedSeconds *
          Math.log(
            input.callerSurfaceDopantPerM3 / input.callerBackgroundDopantPerM3,
          ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSurfaceDopantPerM3: 1e24,
  callerBackgroundDopantPerM3: 1e22,
  callerDiffusivityM2Second: 1e-16,
  callerElapsedSeconds: 100,
} satisfies Input;
export const exampleOutput = {
  modeledGaussianJunctionDepthM: 4.2919320525786947e-7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/junction-depth-gaussian",
  title: "Semiconductor Junction Depth Gaussian Calculator",
  description:
    "Evaluate explicit Gaussian profile/background crossing with caller independently established surface concentration/diffusivity/time; not diffusion-length-only, processing instructions or actual dopant activation.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledGaussianJunctionDepthM",
      label: "Modeled gaussian junction depth m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSurfaceDopantPerM3: value.callerSurfaceDopantPerM3 as number,
      callerBackgroundDopantPerM3: value.callerBackgroundDopantPerM3 as number,
      callerDiffusivityM2Second: value.callerDiffusivityM2Second as number,
      callerElapsedSeconds: value.callerElapsedSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;

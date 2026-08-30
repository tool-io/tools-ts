import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly surfaceIrradiance: number;
  readonly compensationIrradiance: number;
  readonly extinctionCoefficientPerMeter: number;
  readonly maximumObservedDepthM: number;
}>;
export type Output = Readonly<{
  readonly modelCompensationDepthM: number;
  readonly withinObservedWaterColumn: boolean;
}>;
const inputFields = [
  { id: "surfaceIrradiance", label: "Surface irradiance", kind: "number" },
  {
    id: "compensationIrradiance",
    label: "Compensation irradiance",
    kind: "number",
  },
  {
    id: "extinctionCoefficientPerMeter",
    label: "Extinction coefficient per meter",
    kind: "number",
  },
  {
    id: "maximumObservedDepthM",
    label: "Maximum observed depth m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.surfaceIrradiance, "surfaceIrradiance");
  positive(input.compensationIrradiance, "compensationIrradiance");
  positive(
    input.extinctionCoefficientPerMeter,
    "extinctionCoefficientPerMeter",
  );
  nonnegative(input.maximumObservedDepthM, "maximumObservedDepthM");
  if (input.compensationIrradiance > input.surfaceIrradiance)
    simpleError(
      "compensationIrradiance",
      "Compensation irradiance cannot exceed supplied surface irradiance.",
    );
  const modelCompensationDepthM =
    Math.log(input.surfaceIrradiance / input.compensationIrradiance) /
    input.extinctionCoefficientPerMeter;
  return {
    modelCompensationDepthM,
    withinObservedWaterColumn:
      modelCompensationDepthM <= input.maximumObservedDepthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  surfaceIrradiance: 100,
  compensationIrradiance: 1,
  extinctionCoefficientPerMeter: 0.5,
  maximumObservedDepthM: 5,
} satisfies Input;
export const exampleOutput = {
  modelCompensationDepthM: 9.210340371976184,
  withinObservedWaterColumn: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/compensation-depth-light-level",
  title: "Compensation Depth Light Level",
  description:
    "Invert constant optical extinction for a supplied compensation light threshold; a deeper-than-bottom model value is flagged, not silently clipped or declared biologically valid.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelCompensationDepthM",
      label: "Model compensation depth m",
      kind: "number",
    },
    {
      id: "withinObservedWaterColumn",
      label: "Within observed water column",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      surfaceIrradiance: value.surfaceIrradiance as number,
      compensationIrradiance: value.compensationIrradiance as number,
      extinctionCoefficientPerMeter:
        value.extinctionCoefficientPerMeter as number,
      maximumObservedDepthM: value.maximumObservedDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;

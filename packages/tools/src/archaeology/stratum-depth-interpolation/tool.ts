import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  ordered,
  interpolate,
} from "../shared.js";
export type Input = Readonly<{
  readonly controlDepthsM: readonly number[];
  readonly controlCalendarAgesBp: readonly number[];
  readonly sampleDepthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly interpolatedCalendarAgesBp: readonly number[];
}>;
const inputFields = [
  { id: "controlDepthsM", label: "Control depths m", kind: "numberList" },
  {
    id: "controlCalendarAgesBp",
    label: "Control calendar ages bp",
    kind: "numberList",
  },
  { id: "sampleDepthsM", label: "Sample depths m", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.controlDepthsM.forEach((v) => nonnegative(v, "controlDepthsM"));
  input.sampleDepthsM.forEach((v) => nonnegative(v, "sampleDepthsM"));
  ordered(input.controlCalendarAgesBp, "controlCalendarAgesBp");
  return {
    interpolatedCalendarAgesBp: input.sampleDepthsM.map((d) =>
      interpolate(input.controlDepthsM, input.controlCalendarAgesBp, d),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  controlDepthsM: [0, 1, 3],
  controlCalendarAgesBp: [100, 200, 600],
  sampleDepthsM: [0.5, 2],
} satisfies Input;
export const exampleOutput = {
  interpolatedCalendarAgesBp: [150, 400],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/stratum-depth-interpolation",
  title: "Stratum Depth Interpolation",
  description:
    "Interpolate a supplied monotone stratigraphic depth-age model within bracketed control points; no extrapolation, reversals, hiatus uncertainty or sedimentation-rate inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedCalendarAgesBp",
      label: "Interpolated calendar ages bp",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      controlDepthsM: value.controlDepthsM as readonly number[],
      controlCalendarAgesBp: value.controlCalendarAgesBp as readonly number[],
      sampleDepthsM: value.sampleDepthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

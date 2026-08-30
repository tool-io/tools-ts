import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  ordered,
  maximum,
} from "../shared.js";
export type Input = Readonly<{
  readonly depthsM: readonly number[];
  readonly temperaturesC: readonly number[];
}>;
export type Output = Readonly<{
  readonly thermoclineIntervalCenterM: number;
  readonly maximumAbsoluteThermalGradientCPerM: number;
}>;
const inputFields = [
  { id: "depthsM", label: "Depths m", kind: "numberList" },
  { id: "temperaturesC", label: "Temperatures c", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.depthsM.forEach((v) => nonnegative(v, "depthsM"));
  aligned(input.depthsM, input.temperaturesC, "depthsM");
  ordered(input.depthsM, "depthsM");
  const gradients = input.depthsM
      .slice(1)
      .map((z, i) =>
        Math.abs(
          (input.temperaturesC[i + 1] - input.temperaturesC[i]) /
            (z - input.depthsM[i]),
        ),
      ),
    maximumAbsoluteThermalGradientCPerM = maximum(gradients);
  if (
    maximumAbsoluteThermalGradientCPerM === 0 ||
    gradients.filter((v) => v === maximumAbsoluteThermalGradientCPerM)
      .length !== 1
  )
    simpleError(
      "temperaturesC",
      "Unique nonzero sampled maximum gradient required.",
    );
  const i = gradients.indexOf(maximumAbsoluteThermalGradientCPerM);
  return {
    thermoclineIntervalCenterM: (input.depthsM[i] + input.depthsM[i + 1]) / 2,
    maximumAbsoluteThermalGradientCPerM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthsM: [0, 5, 10],
  temperaturesC: [20, 19, 9],
} satisfies Input;
export const exampleOutput = {
  thermoclineIntervalCenterM: 7.5,
  maximumAbsoluteThermalGradientCPerM: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/thermocline-depth-max-gradient",
  title: "Thermocline Depth Max Gradient",
  description:
    "Identify a unique maximum absolute interval temperature gradient, reporting interval center rather than claiming sub-sample thermocline precision.",
  inputs: inputFields,
  outputs: [
    {
      id: "thermoclineIntervalCenterM",
      label: "Thermocline interval center m",
      kind: "number",
    },
    {
      id: "maximumAbsoluteThermalGradientCPerM",
      label: "Maximum absolute thermal gradient c per m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      depthsM: value.depthsM as readonly number[],
      temperaturesC: value.temperaturesC as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

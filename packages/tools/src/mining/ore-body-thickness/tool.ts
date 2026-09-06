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
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedInterceptLengthsM: readonly number[];
  readonly callerBoreholeToLayerNormalAnglesDeg: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedNormalOreThicknessM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedInterceptLengthsM",
    label: "Observed intercept lengths m",
    kind: "numberList",
  },
  {
    id: "callerBoreholeToLayerNormalAnglesDeg",
    label: "Caller borehole to layer normal angles deg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedInterceptLengthsM.forEach((v) =>
    nonnegative(v, "observedInterceptLengthsM"),
  );
  aligned(
    input.observedInterceptLengthsM,
    input.callerBoreholeToLayerNormalAnglesDeg,
    "observedInterceptLengthsM",
  );
  input.callerBoreholeToLayerNormalAnglesDeg.forEach((v) => {
    if (v < 0 || v >= 90)
      simpleError("angle", "Independent borehole/layer-normal angle0≤θ<90.");
  });
  return {
    observedNormalOreThicknessM: input.observedInterceptLengthsM.map(
      (v, i) =>
        v *
        Math.cos(
          (input.callerBoreholeToLayerNormalAnglesDeg[i] * Math.PI) / 180,
        ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInterceptLengthsM: [10, 20],
  callerBoreholeToLayerNormalAnglesDeg: [0, 60],
} satisfies Input;
export const exampleOutput = {
  observedNormalOreThicknessM: [10, 10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ore-body-thickness",
  title: "Ore Body Thickness Calculator",
  description:
    "Correct independently oriented actual drill intercepts to layer-normal thickness, not assumed vertical section height or geological continuity. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedNormalOreThicknessM",
      label: "Observed normal ore thickness m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedInterceptLengthsM:
        value.observedInterceptLengthsM as readonly number[],
      callerBoreholeToLayerNormalAnglesDeg:
        value.callerBoreholeToLayerNormalAnglesDeg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

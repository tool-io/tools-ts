import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, uv, nonnegative } from "../batch-shared.js";
export type Input = Readonly<{
  readonly measuredWhiteXy: readonly number[];
  readonly callerMaximumCie1960UvDistance: number;
}>;
export type Output = Readonly<{
  readonly cie1960UvDistanceFromNominalD65: number;
  readonly withinCallerD65WhiteTolerance: boolean;
}>;
const inputFields = [
  { id: "measuredWhiteXy", label: "Measured white xy", kind: "numberList" },
  {
    id: "callerMaximumCie1960UvDistance",
    label: "Caller maximum cie1960 uv distance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMaximumCie1960UvDistance,
    "callerMaximumCie1960UvDistance",
  );
  const measured = uv(input.measuredWhiteXy),
    target = uv([0.3127, 0.329]),
    distance = Math.hypot(measured[0] - target[0], measured[1] - target[1]);
  return {
    cie1960UvDistanceFromNominalD65: distance,
    withinCallerD65WhiteTolerance:
      distance <= input.callerMaximumCie1960UvDistance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredWhiteXy: [0.3127, 0.329],
  callerMaximumCie1960UvDistance: 0.001,
} satisfies Input;
export const exampleOutput = {
  cie1960UvDistanceFromNominalD65: 0,
  withinCallerD65WhiteTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/white-point-d65-calibration-checker",
  title: "White Point D65 Calibration Check",
  description:
    "Compare measured physical xy white to nominal D65 (.3127,.3290) in CIE 1960 uv using caller tolerance; not CIE1976 u′v′, full display calibration, spectral white equivalence or a color-difference of arbitrary XYZ tristimulus magnitudes.",
  inputs: inputFields,
  outputs: [
    {
      id: "cie1960UvDistanceFromNominalD65",
      label: "Cie1960 uv distance from nominal d65",
      kind: "number",
    },
    {
      id: "withinCallerD65WhiteTolerance",
      label: "Within caller d65 white tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredWhiteXy: value.measuredWhiteXy as readonly number[],
      callerMaximumCie1960UvDistance:
        value.callerMaximumCie1960UvDistance as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  linearFit,
  crossings,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly measuredPb206U238: readonly number[];
  readonly measuredPb207U235: readonly number[];
  readonly callerConcordiaAges: readonly number[];
  readonly callerConcordiaX: readonly number[];
  readonly callerConcordiaY: readonly number[];
}>;
export type Output = Readonly<{
  readonly upperObservedInterceptAge: number;
  readonly allObservedInterceptAges: readonly number[];
}>;
const inputFields = [
  { id: "measuredPb206U238", label: "Measured pb206 u238", kind: "numberList" },
  { id: "measuredPb207U235", label: "Measured pb207 u235", kind: "numberList" },
  {
    id: "callerConcordiaAges",
    label: "Caller concordia ages",
    kind: "numberList",
  },
  { id: "callerConcordiaX", label: "Caller concordia x", kind: "numberList" },
  { id: "callerConcordiaY", label: "Caller concordia y", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const f = linearFit(input.measuredPb206U238, input.measuredPb207U235);
  aligned(input.callerConcordiaAges, input.callerConcordiaX, "concordia");
  aligned(input.callerConcordiaX, input.callerConcordiaY, "concordia");
  const a = crossings(
    input.callerConcordiaAges,
    input.callerConcordiaX.map(
      (x, i) => input.callerConcordiaY[i] - f.intercept - f.slope * x,
    ),
    0,
  );
  if (!a.length)
    simpleError(
      "intersection",
      "No observed concordia intersection in supplied age coverage.",
    );
  return {
    upperObservedInterceptAge: Math.max(...a),
    allObservedInterceptAges: a,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredPb206U238: [1, 2, 3],
  measuredPb207U235: [2, 4, 6],
  callerConcordiaAges: [0, 1, 2, 3],
  callerConcordiaX: [0, 1, 2, 3],
  callerConcordiaY: [1, 2, 3, 7],
} satisfies Input;
export const exampleOutput = {
  upperObservedInterceptAge: 2.5,
  allObservedInterceptAges: [1, 2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/u-pb-discordia-upper-intercept",
  title: "Geology U Pb Discordia Upper Intercept Calculator",
  description:
    "Actual discordia regression intersected with independently matched piecewise-linear concordia, all witnesses and upper observed intercept retained; not extrapolated older geological event. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "upperObservedInterceptAge",
      label: "Upper observed intercept age",
      kind: "number",
    },
    {
      id: "allObservedInterceptAges",
      label: "All observed intercept ages",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredPb206U238: value.measuredPb206U238 as readonly number[],
      measuredPb207U235: value.measuredPb207U235 as readonly number[],
      callerConcordiaAges: value.callerConcordiaAges as readonly number[],
      callerConcordiaX: value.callerConcordiaX as readonly number[],
      callerConcordiaY: value.callerConcordiaY as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

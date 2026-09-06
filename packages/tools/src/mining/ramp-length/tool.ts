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
  sum,
  shape,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedRampSurveyXyzM: readonly (readonly number[])[];
  readonly callerIndependentRouteChainageM: number;
}>;
export type Output = Readonly<{
  readonly observedRampSurveyPolylineM: number;
  readonly signedChainageMinusSurveyM: number;
}>;
const inputFields = [
  {
    id: "observedRampSurveyXyzM",
    label: "Observed ramp survey xyz m",
    kind: "matrix",
  },
  {
    id: "callerIndependentRouteChainageM",
    label: "Caller independent route chainage m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    shape(input.observedRampSurveyXyzM, "ramp") !== 3 ||
    input.observedRampSurveyXyzM.length < 2
  )
    simpleError("survey", "2–128 local XYZ ramp route vertices required.");
  nonnegative(input.callerIndependentRouteChainageM, "chainage");
  const p = input.observedRampSurveyXyzM,
    length = sum(
      p
        .slice(1)
        .map((v, i) =>
          Math.hypot(v[0] - p[i][0], v[1] - p[i][1], v[2] - p[i][2]),
        ),
    );
  return {
    observedRampSurveyPolylineM: length,
    signedChainageMinusSurveyM: input.callerIndependentRouteChainageM - length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRampSurveyXyzM: [
    [0, 0, 0],
    [3, 4, 0],
    [3, 4, 12],
  ],
  callerIndependentRouteChainageM: 18,
} satisfies Input;
export const exampleOutput = {
  observedRampSurveyPolylineM: 17,
  signedChainageMinusSurveyM: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ramp-length",
  title: "Ramp Length Calculator",
  description:
    "Audit actual local3D ramp route polyline against independently reported chainage, not aggregate horizontal-run/rise modeled haul distance or geodesy. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRampSurveyPolylineM",
      label: "Observed ramp survey polyline m",
      kind: "number",
    },
    {
      id: "signedChainageMinusSurveyM",
      label: "Signed chainage minus survey m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRampSurveyXyzM:
        value.observedRampSurveyXyzM as readonly (readonly number[])[],
      callerIndependentRouteChainageM:
        value.callerIndependentRouteChainageM as number,
    }),
});
export const run = tool.execute;
export default tool;

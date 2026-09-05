import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, sum, shape } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedOreStrikeTraceLocalXyM: readonly (readonly number[])[];
  readonly callerIndependentlyOrderedStrikeTraceVerified: boolean;
}>;
export type Output = Readonly<{
  readonly observedStrikePolylineLengthM: number;
}>;
const inputFields = [
  {
    id: "observedOreStrikeTraceLocalXyM",
    label: "Observed ore strike trace local xy m",
    kind: "matrix",
  },
  {
    id: "callerIndependentlyOrderedStrikeTraceVerified",
    label: "Caller independently ordered strike trace verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.callerIndependentlyOrderedStrikeTraceVerified ||
    shape(input.observedOreStrikeTraceLocalXyM, "trace") !== 2 ||
    input.observedOreStrikeTraceLocalXyM.length < 2
  )
    simpleError(
      "trace",
      "Independently ordered local strike trace points required, no geographic projection.",
    );
  const p = input.observedOreStrikeTraceLocalXyM;
  return {
    observedStrikePolylineLengthM: sum(
      p.slice(1).map((v, i) => Math.hypot(v[0] - p[i][0], v[1] - p[i][1])),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOreStrikeTraceLocalXyM: [
    [0, 0],
    [3, 0],
    [3, 4],
  ],
  callerIndependentlyOrderedStrikeTraceVerified: true,
} satisfies Input;
export const exampleOutput = {
  observedStrikePolylineLengthM: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ore-body-strike-length",
  title: "Ore Body Strike Length Calculator",
  description:
    "Inventory actual independently identified local ore strike trace segments, not point-to-point map distance or discovery of strike/geodesy. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedStrikePolylineLengthM",
      label: "Observed strike polyline length m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOreStrikeTraceLocalXyM:
        value.observedOreStrikeTraceLocalXyM as readonly (readonly number[])[],
      callerIndependentlyOrderedStrikeTraceVerified:
        value.callerIndependentlyOrderedStrikeTraceVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;

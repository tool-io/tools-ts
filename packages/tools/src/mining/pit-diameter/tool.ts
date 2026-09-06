import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, shape } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedPitBoundaryLocalXyM: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly maximumObservedPitBoundaryChordM: number;
}>;
const inputFields = [
  {
    id: "observedPitBoundaryLocalXyM",
    label: "Observed pit boundary local xy m",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    shape(input.observedPitBoundaryLocalXyM, "boundary") !== 2 ||
    input.observedPitBoundaryLocalXyM.length < 2
  )
    simpleError("boundary", "2–128 actual local planar boundary points.");
  let largest = 0;
  input.observedPitBoundaryLocalXyM.forEach((p, i) =>
    input.observedPitBoundaryLocalXyM.slice(i + 1).forEach((q) => {
      largest = Math.max(largest, Math.hypot(p[0] - q[0], p[1] - q[1]));
    }),
  );
  return { maximumObservedPitBoundaryChordM: largest };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPitBoundaryLocalXyM: [
    [0, 0],
    [3, 0],
    [3, 4],
  ],
} satisfies Input;
export const exampleOutput = {
  maximumObservedPitBoundaryChordM: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/pit-diameter",
  title: "Pit Diameter Calculator",
  description:
    "Measure maximum actual local pit-boundary point-pair chord, not equivalent-area circle diameter, unsampled boundary inference or geodesy. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumObservedPitBoundaryChordM",
      label: "Maximum observed pit boundary chord m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPitBoundaryLocalXyM:
        value.observedPitBoundaryLocalXyM as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;

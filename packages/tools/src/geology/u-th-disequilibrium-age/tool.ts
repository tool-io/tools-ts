import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, crossings } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerClosedSystemCandidateAges: readonly number[];
  readonly callerMatchedTh230U238Activities: readonly number[];
  readonly observedTh230U238Activity: number;
}>;
export type Output = Readonly<{
  readonly matchingClosedSystemAges: readonly number[];
}>;
const inputFields = [
  {
    id: "callerClosedSystemCandidateAges",
    label: "Caller closed system candidate ages",
    kind: "numberList",
  },
  {
    id: "callerMatchedTh230U238Activities",
    label: "Caller matched th230 u238 activities",
    kind: "numberList",
  },
  {
    id: "observedTh230U238Activity",
    label: "Observed th230 u238 activity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchingClosedSystemAges: crossings(
      input.callerClosedSystemCandidateAges,
      input.callerMatchedTh230U238Activities,
      input.observedTh230U238Activity,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerClosedSystemCandidateAges: [0, 1, 2],
  callerMatchedTh230U238Activities: [0, 0.5, 0.75],
  observedTh230U238Activity: 0.625,
} satisfies Input;
export const exampleOutput = {
  matchingClosedSystemAges: [1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/u-th-disequilibrium-age",
  title: "Geology U Th Disequilibrium Age Calculator",
  description:
    "U–Th disequilibrium inversion of independently solved matching initialU234/detritalTh/decay closed-system candidate activity curve, all roots retained; no secular-equilibrium shortcut. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchingClosedSystemAges",
      label: "Matching closed system ages",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerClosedSystemCandidateAges:
        value.callerClosedSystemCandidateAges as readonly number[],
      callerMatchedTh230U238Activities:
        value.callerMatchedTh230U238Activities as readonly number[],
      observedTh230U238Activity: value.observedTh230U238Activity as number,
    }),
});
export const run = tool.execute;
export default tool;

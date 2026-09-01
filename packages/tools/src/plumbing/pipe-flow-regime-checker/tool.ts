import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedReynoldsNumbers: readonly number[];
  readonly callerLaminarMaximumRe: number;
  readonly callerTurbulentMinimumRe: number;
}>;
export type Output = Readonly<{
  readonly callerFlowRegimeLabels: readonly string[];
}>;
const inputFields = [
  {
    id: "observedReynoldsNumbers",
    label: "Observed reynolds numbers",
    kind: "numberList",
  },
  {
    id: "callerLaminarMaximumRe",
    label: "Caller laminar maximum re",
    kind: "number",
  },
  {
    id: "callerTurbulentMinimumRe",
    label: "Caller turbulent minimum re",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedReynoldsNumbers.forEach((v) =>
    nonnegative(v, "observedReynoldsNumbers"),
  );
  nonnegative(input.callerLaminarMaximumRe, "callerLaminarMaximumRe");
  nonnegative(input.callerTurbulentMinimumRe, "callerTurbulentMinimumRe");
  if (input.callerTurbulentMinimumRe <= input.callerLaminarMaximumRe)
    simpleError(
      "regime",
      "Distinct ordered caller regime thresholds required.",
    );
  return {
    callerFlowRegimeLabels: input.observedReynoldsNumbers.map((v) =>
      v <= input.callerLaminarMaximumRe
        ? "laminar"
        : v >= input.callerTurbulentMinimumRe
          ? "turbulent"
          : "transition",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedReynoldsNumbers: [1000, 3000, 5000],
  callerLaminarMaximumRe: 2300,
  callerTurbulentMinimumRe: 4000,
} satisfies Input;
export const exampleOutput = {
  callerFlowRegimeLabels: ["laminar", "transition", "turbulent"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pipe-flow-regime-checker",
  title: "Plumbing Pipe Flow Regime Checker",
  description:
    "Classify actual Reynolds evidence under explicit caller laminar/turbulent bounds, preserving transition instead of forcing turbulent friction equation; not laminar-factor calculation or safety criterion.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerFlowRegimeLabels",
      label: "Caller flow regime labels",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedReynoldsNumbers:
        value.observedReynoldsNumbers as readonly number[],
      callerLaminarMaximumRe: value.callerLaminarMaximumRe as number,
      callerTurbulentMinimumRe: value.callerTurbulentMinimumRe as number,
    }),
});
export const run = tool.execute;
export default tool;

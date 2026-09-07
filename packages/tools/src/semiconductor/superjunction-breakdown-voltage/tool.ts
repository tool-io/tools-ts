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
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedSuperjunctionReverseV: readonly number[];
  readonly observedLeakageAmps: readonly number[];
  readonly callerBreakdownLeakageCriterionAmps: number;
  readonly callerIndependentlyBalancedPillarsVerified: boolean;
}>;
export type Output = Readonly<{
  readonly observedCriterionBreakdownCrossingsV: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSuperjunctionReverseV",
    label: "Observed superjunction reverse v",
    kind: "numberList",
  },
  {
    id: "observedLeakageAmps",
    label: "Observed leakage amps",
    kind: "numberList",
  },
  {
    id: "callerBreakdownLeakageCriterionAmps",
    label: "Caller breakdown leakage criterion amps",
    kind: "number",
  },
  {
    id: "callerIndependentlyBalancedPillarsVerified",
    label: "Caller independently balanced pillars verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSuperjunctionReverseV.forEach((v) =>
    nonnegative(v, "observedSuperjunctionReverseV"),
  );
  input.observedLeakageAmps.forEach((v) =>
    nonnegative(v, "observedLeakageAmps"),
  );
  nonnegative(
    input.callerBreakdownLeakageCriterionAmps,
    "callerBreakdownLeakageCriterionAmps",
  );
  if (!input.callerIndependentlyBalancedPillarsVerified)
    simpleError(
      "pillars",
      "Explicit balanced-pillar test branch evidence required.",
    );
  return {
    observedCriterionBreakdownCrossingsV: crossings(
      input.observedSuperjunctionReverseV,
      input.observedLeakageAmps,
      input.callerBreakdownLeakageCriterionAmps,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSuperjunctionReverseV: [0, 10, 20],
  observedLeakageAmps: [0, 1, 3],
  callerBreakdownLeakageCriterionAmps: 2,
  callerIndependentlyBalancedPillarsVerified: true,
} satisfies Input;
export const exampleOutput = {
  observedCriterionBreakdownCrossingsV: [15],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/superjunction-breakdown-voltage",
  title: "Semiconductor Superjunction Breakdown Voltage Calculator",
  description:
    "Extract measured balanced-superjunction test criterion crossings, not peak-field triangular avalanche estimate or charge balance alone; no inferred safe blocking voltage or destructive test instructions.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCriterionBreakdownCrossingsV",
      label: "Observed criterion breakdown crossings v",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSuperjunctionReverseV:
        value.observedSuperjunctionReverseV as readonly number[],
      observedLeakageAmps: value.observedLeakageAmps as readonly number[],
      callerBreakdownLeakageCriterionAmps:
        value.callerBreakdownLeakageCriterionAmps as number,
      callerIndependentlyBalancedPillarsVerified:
        value.callerIndependentlyBalancedPillarsVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;

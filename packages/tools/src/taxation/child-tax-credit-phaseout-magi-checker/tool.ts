import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  integer,
  money,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly magiMinor: number;
  readonly callerPhaseoutThresholdMinor: number;
  readonly callerReductionPerStartedStepMinor: number;
  readonly callerPhaseoutStepMinor: number;
  readonly callerInitialCreditMinor: number;
}>;
export type Output = Readonly<{
  readonly startedPhaseoutSteps: number;
  readonly conditionalRemainingCreditMinor: number;
}>;
const inputFields = [
  { id: "magiMinor", label: "Magi minor", kind: "number" },
  {
    id: "callerPhaseoutThresholdMinor",
    label: "Caller phaseout threshold minor",
    kind: "number",
  },
  {
    id: "callerReductionPerStartedStepMinor",
    label: "Caller reduction per started step minor",
    kind: "number",
  },
  {
    id: "callerPhaseoutStepMinor",
    label: "Caller phaseout step minor",
    kind: "number",
  },
  {
    id: "callerInitialCreditMinor",
    label: "Caller initial credit minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.magiMinor, "magiMinor");
  money(input.callerPhaseoutThresholdMinor, "callerPhaseoutThresholdMinor");
  money(
    input.callerReductionPerStartedStepMinor,
    "callerReductionPerStartedStepMinor",
  );
  money(input.callerPhaseoutStepMinor, "callerPhaseoutStepMinor");
  money(input.callerInitialCreditMinor, "callerInitialCreditMinor");
  positive(input.callerPhaseoutStepMinor, "step");
  const excess = BigInt(
      Math.max(0, input.magiMinor - input.callerPhaseoutThresholdMinor),
    ),
    step = BigInt(input.callerPhaseoutStepMinor),
    n = (excess + step - 1n) / step,
    reduction = n * BigInt(input.callerReductionPerStartedStepMinor),
    credit = BigInt(input.callerInitialCreditMinor);
  return {
    startedPhaseoutSteps: integer(Number(n), "steps"),
    conditionalRemainingCreditMinor: Number(
      reduction >= credit ? 0n : credit - reduction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  magiMinor: 125,
  callerPhaseoutThresholdMinor: 100,
  callerReductionPerStartedStepMinor: 5,
  callerPhaseoutStepMinor: 10,
  callerInitialCreditMinor: 30,
} satisfies Input;
export const exampleOutput = {
  startedPhaseoutSteps: 3,
  conditionalRemainingCreditMinor: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/child-tax-credit-phaseout-magi-checker",
  title: "Child Tax Credit Phaseout MAGI Checker",
  description:
    "Child-credit independently applicable steppedMAGIphaseout using each STARTED step, no smooth linear substitute, eligibility/refundability external. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "startedPhaseoutSteps",
      label: "Started phaseout steps",
      kind: "number",
    },
    {
      id: "conditionalRemainingCreditMinor",
      label: "Conditional remaining credit minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      magiMinor: value.magiMinor as number,
      callerPhaseoutThresholdMinor:
        value.callerPhaseoutThresholdMinor as number,
      callerReductionPerStartedStepMinor:
        value.callerReductionPerStartedStepMinor as number,
      callerPhaseoutStepMinor: value.callerPhaseoutStepMinor as number,
      callerInitialCreditMinor: value.callerInitialCreditMinor as number,
    }),
});
export const run = tool.execute;
export default tool;

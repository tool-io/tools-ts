import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyVerifiedEventAges: readonly number[];
  readonly callerCalibratedSeverityScores: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyVerifiedEventAges",
    label: "Independently verified event ages",
    kind: "numberList",
  },
  {
    id: "callerCalibratedSeverityScores",
    label: "Caller calibrated severity scores",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyVerifiedEventAges,
    input.callerCalibratedSeverityScores,
    "events",
  );
  strictlyIncreasing(input.independentlyVerifiedEventAges, "age", 2);
  input.independentlyVerifiedEventAges.forEach((v) => nonnegative(v, "age"));
  input.callerCalibratedSeverityScores.forEach((v) => nonnegative(v, "score"));
  return {
    observedOnsetAge: input.independentlyVerifiedEventAges[0],
    signedFirstLastSeverityChange:
      input.callerCalibratedSeverityScores.at(-1)! -
      input.callerCalibratedSeverityScores[0],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyVerifiedEventAges: [15, 18, 20],
    callerCalibratedSeverityScores: [1, 2, 3],
  },
  output: {
    result: { observedOnsetAge: 15, signedFirstLastSeverityChange: 2 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/onset-age-escalation-severity-checker",
  title: "Onset Age Escalation Severity Checker",
  description:
    "Actual ordered event-age/severity sequence first/last discrepancy under independent rubric. No causal onset/escalation or future dangerousness inference; not all earlier unrecorded events observed.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

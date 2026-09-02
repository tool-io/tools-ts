import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyAttestedApplicableQuorum: number;
  readonly observedEligibleAttendees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAttestedApplicableQuorum",
    label: "Independently attested applicable quorum",
    kind: "number",
  },
  {
    id: "observedEligibleAttendees",
    label: "Observed eligible attendees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.independentlyAttestedApplicableQuorum, "quorum", 1, 1000000);
  bounded(input.observedEligibleAttendees, "attendees", 0, 1000000);
  return {
    signedAttendeeMargin:
      input.observedEligibleAttendees -
      input.independentlyAttestedApplicableQuorum,
    meetsCallerQuorum:
      input.observedEligibleAttendees >=
      input.independentlyAttestedApplicableQuorum,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAttestedApplicableQuorum: 6000,
    observedEligibleAttendees: 5999,
  },
  output: { result: { signedAttendeeMargin: -1, meetsCallerQuorum: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/athenian-assembly-6000-quorum-checker",
  title: "Athenian Assembly 6000 Quorum Checker",
  description:
    "Compare actual eligible attendance with independently attested specific Athenian procedure/date quorum;6000is not asserted for all assembly business.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedIsoNsoTreatmentKeys: readonly string[];
  readonly callerVerifiedIsoNsoTreatmentNotices: readonly string[];
  readonly queryIsoNsoTreatmentKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedIsoNsoTreatmentKeys",
    label: "Caller verified iso nso treatment keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedIsoNsoTreatmentNotices",
    label: "Caller verified iso nso treatment notices",
    kind: "stringList",
  },
  {
    id: "queryIsoNsoTreatmentKey",
    label: "Query iso nso treatment key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedIsoNsoTreatmentKeys,
      input.callerVerifiedIsoNsoTreatmentNotices,
      input.queryIsoNsoTreatmentKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedIsoNsoTreatmentKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedIsoNsoTreatmentNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryIsoNsoTreatmentKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/iso-vs-nso-high-level-treatment-lookup",
  title: "Iso vs Nso High Level Treatment Lookup",
  description:
    "Caller independently verified jurisdiction/tax-year/award ISO vsNSO treatment notice, no statutory eligibility inferred. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedCallerNotice",
      label: "Matched caller notice",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedIsoNsoTreatmentKeys:
        value.callerVerifiedIsoNsoTreatmentKeys as readonly string[],
      callerVerifiedIsoNsoTreatmentNotices:
        value.callerVerifiedIsoNsoTreatmentNotices as readonly string[],
      queryIsoNsoTreatmentKey: value.queryIsoNsoTreatmentKey as string,
    }),
});
export const run = tool.execute;
export default tool;

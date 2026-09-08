import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedInputVatRestrictionKeys: readonly string[];
  readonly callerVerifiedInputVatRestrictionNotices: readonly string[];
  readonly queryInputVatRestrictionKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedInputVatRestrictionKeys",
    label: "Caller verified input vat restriction keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedInputVatRestrictionNotices",
    label: "Caller verified input vat restriction notices",
    kind: "stringList",
  },
  {
    id: "queryInputVatRestrictionKey",
    label: "Query input vat restriction key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedInputVatRestrictionKeys,
      input.callerVerifiedInputVatRestrictionNotices,
      input.queryInputVatRestrictionKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedInputVatRestrictionKeys: [
    "site-a/edition-a",
    "site-a/edition-b",
  ],
  callerVerifiedInputVatRestrictionNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryInputVatRestrictionKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/input-vat-recovery-restricted-percent-lookup",
  title: "Input VAT Recovery Restricted Percent Lookup",
  description:
    "Caller exact independently verified VAT use/exemption/date recoverable-input proportion reference, not universal tax rate. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedInputVatRestrictionKeys:
        value.callerVerifiedInputVatRestrictionKeys as readonly string[],
      callerVerifiedInputVatRestrictionNotices:
        value.callerVerifiedInputVatRestrictionNotices as readonly string[],
      queryInputVatRestrictionKey: value.queryInputVatRestrictionKey as string,
    }),
});
export const run = tool.execute;
export default tool;

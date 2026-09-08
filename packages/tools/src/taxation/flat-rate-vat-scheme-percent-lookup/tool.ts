import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFlatRateVatKeys: readonly string[];
  readonly callerVerifiedFlatRateVatNotices: readonly string[];
  readonly queryFlatRateVatKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedFlatRateVatKeys",
    label: "Caller verified flat rate vat keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFlatRateVatNotices",
    label: "Caller verified flat rate vat notices",
    kind: "stringList",
  },
  {
    id: "queryFlatRateVatKey",
    label: "Query flat rate vat key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedFlatRateVatKeys,
      input.callerVerifiedFlatRateVatNotices,
      input.queryFlatRateVatKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFlatRateVatKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedFlatRateVatNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryFlatRateVatKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/flat-rate-vat-scheme-percent-lookup",
  title: "Flat Rate VAT Scheme Percent Lookup",
  description:
    "Caller exact independently verified country/scheme/industry/date VAT flat-rate notice. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedFlatRateVatKeys:
        value.callerVerifiedFlatRateVatKeys as readonly string[],
      callerVerifiedFlatRateVatNotices:
        value.callerVerifiedFlatRateVatNotices as readonly string[],
      queryFlatRateVatKey: value.queryFlatRateVatKey as string,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedEstatePortabilityKeys: readonly string[];
  readonly callerVerifiedEstatePortabilityNotices: readonly string[];
  readonly queryEstatePortabilityKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedEstatePortabilityKeys",
    label: "Caller verified estate portability keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedEstatePortabilityNotices",
    label: "Caller verified estate portability notices",
    kind: "stringList",
  },
  {
    id: "queryEstatePortabilityKey",
    label: "Query estate portability key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedEstatePortabilityKeys,
      input.callerVerifiedEstatePortabilityNotices,
      input.queryEstatePortabilityKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedEstatePortabilityKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedEstatePortabilityNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryEstatePortabilityKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/estate-exemption-portability-election-checker",
  title: "Estate Exemption Portability Election Checker",
  description:
    "Caller independently verified estate/death-date portability election notice/requirements, not automatic inherited exemption. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedEstatePortabilityKeys:
        value.callerVerifiedEstatePortabilityKeys as readonly string[],
      callerVerifiedEstatePortabilityNotices:
        value.callerVerifiedEstatePortabilityNotices as readonly string[],
      queryEstatePortabilityKey: value.queryEstatePortabilityKey as string,
    }),
});
export const run = tool.execute;
export default tool;

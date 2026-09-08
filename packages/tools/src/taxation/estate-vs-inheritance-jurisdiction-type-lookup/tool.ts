import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedEstateInheritanceTypeKeys: readonly string[];
  readonly callerVerifiedEstateInheritanceTypeNotices: readonly string[];
  readonly queryEstateInheritanceTypeKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedEstateInheritanceTypeKeys",
    label: "Caller verified estate inheritance type keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedEstateInheritanceTypeNotices",
    label: "Caller verified estate inheritance type notices",
    kind: "stringList",
  },
  {
    id: "queryEstateInheritanceTypeKey",
    label: "Query estate inheritance type key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedEstateInheritanceTypeKeys,
      input.callerVerifiedEstateInheritanceTypeNotices,
      input.queryEstateInheritanceTypeKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedEstateInheritanceTypeKeys: [
    "site-a/edition-a",
    "site-a/edition-b",
  ],
  callerVerifiedEstateInheritanceTypeNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryEstateInheritanceTypeKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/estate-vs-inheritance-jurisdiction-type-lookup",
  title: "Estate vs Inheritance Jurisdiction Type Lookup",
  description:
    "Caller independently verified jurisdiction/year estate-vs-inheritance regime notice; no double taxation inference. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedEstateInheritanceTypeKeys:
        value.callerVerifiedEstateInheritanceTypeKeys as readonly string[],
      callerVerifiedEstateInheritanceTypeNotices:
        value.callerVerifiedEstateInheritanceTypeNotices as readonly string[],
      queryEstateInheritanceTypeKey:
        value.queryEstateInheritanceTypeKey as string,
    }),
});
export const run = tool.execute;
export default tool;

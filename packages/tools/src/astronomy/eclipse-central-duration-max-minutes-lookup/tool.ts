import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedCentralEclipseDurationKeys: readonly string[];
  readonly callerVerifiedCentralEclipseDurationNotices: readonly string[];
  readonly queryCentralEclipseDurationKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedCentralEclipseDurationKeys",
    label: "Caller verified central eclipse duration keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedCentralEclipseDurationNotices",
    label: "Caller verified central eclipse duration notices",
    kind: "stringList",
  },
  {
    id: "queryCentralEclipseDurationKey",
    label: "Query central eclipse duration key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedCentralEclipseDurationKeys,
      input.callerVerifiedCentralEclipseDurationNotices,
      input.queryCentralEclipseDurationKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedCentralEclipseDurationKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedCentralEclipseDurationNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryCentralEclipseDurationKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/eclipse-central-duration-max-minutes-lookup",
  title: "Max Central Eclipse Duration Minutes Lookup",
  description:
    "Independently verified eclipse type/geometry/catalog maximum duration record, not current-location eclipse prediction. Exact independently verified context/edition key; not embedded or live reference data. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      callerVerifiedCentralEclipseDurationKeys:
        value.callerVerifiedCentralEclipseDurationKeys as readonly string[],
      callerVerifiedCentralEclipseDurationNotices:
        value.callerVerifiedCentralEclipseDurationNotices as readonly string[],
      queryCentralEclipseDurationKey:
        value.queryCentralEclipseDurationKey as string,
    }),
});
export const run = tool.execute;
export default tool;

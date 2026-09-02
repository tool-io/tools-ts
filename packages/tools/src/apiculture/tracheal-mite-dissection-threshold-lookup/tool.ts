import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTrachealMiteThresholdKeys: readonly string[];
  readonly callerVerifiedTrachealMiteThresholdNotices: readonly string[];
  readonly queryTrachealMiteThresholdKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedTrachealMiteThresholdKeys",
    label: "Caller verified tracheal mite threshold keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTrachealMiteThresholdNotices",
    label: "Caller verified tracheal mite threshold notices",
    kind: "stringList",
  },
  {
    id: "queryTrachealMiteThresholdKey",
    label: "Query tracheal mite threshold key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedTrachealMiteThresholdKeys,
      input.callerVerifiedTrachealMiteThresholdNotices,
      input.queryTrachealMiteThresholdKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedTrachealMiteThresholdKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedTrachealMiteThresholdNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryTrachealMiteThresholdKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/tracheal-mite-dissection-threshold-lookup",
  title: "Tracheal Mite Dissection Threshold Lookup",
  description:
    "Caller independently verified sampling/dissection/strain/site protocol threshold notice, not treatment recommendation. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedTrachealMiteThresholdKeys:
        value.callerVerifiedTrachealMiteThresholdKeys as readonly string[],
      callerVerifiedTrachealMiteThresholdNotices:
        value.callerVerifiedTrachealMiteThresholdNotices as readonly string[],
      queryTrachealMiteThresholdKey:
        value.queryTrachealMiteThresholdKey as string,
    }),
});
export const run = tool.execute;
export default tool;

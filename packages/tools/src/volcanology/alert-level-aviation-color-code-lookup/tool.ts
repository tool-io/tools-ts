import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAviationAlertKeys: readonly string[];
  readonly callerVerifiedAviationAlertNotices: readonly string[];
  readonly queryAviationAlertKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedAviationAlertKeys",
    label: "Caller verified aviation alert keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAviationAlertNotices",
    label: "Caller verified aviation alert notices",
    kind: "stringList",
  },
  {
    id: "queryAviationAlertKey",
    label: "Query aviation alert key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedAviationAlertKeys,
    input.callerVerifiedAviationAlertNotices,
    "callerVerifiedAviationAlertKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedAviationAlertKeys,
    input.queryAviationAlertKey,
  );
  if (input.callerVerifiedAviationAlertNotices.some((v) => !v.trim()))
    simpleError("notice", "Explicit caller verified notices required.");
  return { matchedCallerNotice: input.callerVerifiedAviationAlertNotices[i] };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAviationAlertKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedAviationAlertNotices: ["caller notice a", "caller notice b"],
  queryAviationAlertKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller notice b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/alert-level-aviation-color-code-lookup",
  title: "Alert Level Aviation Color Code Lookup",
  description:
    "Read caller independently verified authority/volcano/edition alert code notice. Only exact caller independently verified authority/site/edition key, no live status or generalized safety rule. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      callerVerifiedAviationAlertKeys:
        value.callerVerifiedAviationAlertKeys as readonly string[],
      callerVerifiedAviationAlertNotices:
        value.callerVerifiedAviationAlertNotices as readonly string[],
      queryAviationAlertKey: value.queryAviationAlertKey as string,
    }),
});
export const run = tool.execute;
export default tool;

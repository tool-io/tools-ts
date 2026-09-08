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
  readonly callerVerifiedAshfallAdvisoryKeys: readonly string[];
  readonly callerVerifiedAshfallAdvisoryNotices: readonly string[];
  readonly queryAshfallAdvisoryKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedAshfallAdvisoryKeys",
    label: "Caller verified ashfall advisory keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAshfallAdvisoryNotices",
    label: "Caller verified ashfall advisory notices",
    kind: "stringList",
  },
  {
    id: "queryAshfallAdvisoryKey",
    label: "Query ashfall advisory key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedAshfallAdvisoryKeys,
    input.callerVerifiedAshfallAdvisoryNotices,
    "callerVerifiedAshfallAdvisoryKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedAshfallAdvisoryKeys,
    input.queryAshfallAdvisoryKey,
  );
  if (input.callerVerifiedAshfallAdvisoryNotices.some((v) => !v.trim()))
    simpleError("notice", "Explicit caller verified notices required.");
  return { matchedCallerNotice: input.callerVerifiedAshfallAdvisoryNotices[i] };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAshfallAdvisoryKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedAshfallAdvisoryNotices: ["caller notice a", "caller notice b"],
  queryAshfallAdvisoryKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller notice b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/ashfall-advisory-thickness-action-lookup",
  title: "Ashfall Advisory Thickness Action Lookup",
  description:
    "Read independently verified site/material/authority ashfall action notice, not universal thickness safety. Only exact caller independently verified authority/site/edition key, no live status or generalized safety rule. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      callerVerifiedAshfallAdvisoryKeys:
        value.callerVerifiedAshfallAdvisoryKeys as readonly string[],
      callerVerifiedAshfallAdvisoryNotices:
        value.callerVerifiedAshfallAdvisoryNotices as readonly string[],
      queryAshfallAdvisoryKey: value.queryAshfallAdvisoryKey as string,
    }),
});
export const run = tool.execute;
export default tool;

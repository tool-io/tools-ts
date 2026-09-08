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
  readonly callerVerifiedTephraMarkerKeys: readonly string[];
  readonly callerVerifiedTephraMarkerNotices: readonly string[];
  readonly queryTephraMarkerKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedTephraMarkerKeys",
    label: "Caller verified tephra marker keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTephraMarkerNotices",
    label: "Caller verified tephra marker notices",
    kind: "stringList",
  },
  {
    id: "queryTephraMarkerKey",
    label: "Query tephra marker key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedTephraMarkerKeys,
    input.callerVerifiedTephraMarkerNotices,
    "callerVerifiedTephraMarkerKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedTephraMarkerKeys,
    input.queryTephraMarkerKey,
  );
  if (input.callerVerifiedTephraMarkerNotices.some((v) => !v.trim()))
    simpleError("notice", "Explicit caller verified notices required.");
  return { matchedCallerNotice: input.callerVerifiedTephraMarkerNotices[i] };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedTephraMarkerKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedTephraMarkerNotices: ["caller notice a", "caller notice b"],
  queryTephraMarkerKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller notice b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/tephrochronology-marker-shard-lookup",
  title: "Tephrochronology Marker Shard Lookup",
  description:
    "Read independently supplied analytical provenance/age/source marker notice, no shard authenticity or identity from visual descriptors. Only exact caller independently verified authority/site/edition key, no live status or generalized safety rule. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      callerVerifiedTephraMarkerKeys:
        value.callerVerifiedTephraMarkerKeys as readonly string[],
      callerVerifiedTephraMarkerNotices:
        value.callerVerifiedTephraMarkerNotices as readonly string[],
      queryTephraMarkerKey: value.queryTephraMarkerKey as string,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedGrimmCorrespondenceKeys: readonly string[];
  readonly callerVerifiedGrimmCorrespondenceNotices: readonly string[];
  readonly queryGrimmCorrespondenceKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedGrimmCorrespondenceKeys",
    label: "Caller verified grimm correspondence keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedGrimmCorrespondenceNotices",
    label: "Caller verified grimm correspondence notices",
    kind: "stringList",
  },
  {
    id: "queryGrimmCorrespondenceKey",
    label: "Query grimm correspondence key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedGrimmCorrespondenceKeys,
      input.callerVerifiedGrimmCorrespondenceNotices,
      input.queryGrimmCorrespondenceKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedGrimmCorrespondenceKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedGrimmCorrespondenceNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryGrimmCorrespondenceKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/grimm-law-correspondence-pair-lookup",
  title: "Grimm Law Correspondence Pair Lookup",
  description:
    "Independently verified conditioned ProtoIndoEuropean/ProtoGermanic sound correspondence, not arbitrary modern phoneme replacement. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedGrimmCorrespondenceKeys:
        value.callerVerifiedGrimmCorrespondenceKeys as readonly string[],
      callerVerifiedGrimmCorrespondenceNotices:
        value.callerVerifiedGrimmCorrespondenceNotices as readonly string[],
      queryGrimmCorrespondenceKey: value.queryGrimmCorrespondenceKey as string,
    }),
});
export const run = tool.execute;
export default tool;

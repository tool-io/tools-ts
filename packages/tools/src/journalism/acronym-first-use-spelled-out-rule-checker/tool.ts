import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  literal,
  bounded,
  codepoints,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly copyText: string;
  readonly acronymToken: string;
  readonly callerFullName: string;
  readonly callerExactFirstUsePattern: string;
}>;
export type Output = Readonly<{
  readonly firstAcronymCodepointOffset: number;
  readonly firstUseExpansionPatternPresent: boolean;
  readonly observedAcronymTokenCount: number;
}>;
const inputFields = [
  { id: "copyText", label: "Copy text", kind: "string" },
  { id: "acronymToken", label: "Acronym token", kind: "string" },
  { id: "callerFullName", label: "Caller full name", kind: "string" },
  {
    id: "callerExactFirstUsePattern",
    label: "Caller exact first use pattern",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !/^[A-Z][A-Z0-9]{1,15}$(?![\s\S])/.test(input.acronymToken) ||
    !input.callerFullName.trim() ||
    input.callerFullName.length > 4096
  )
    simpleError(
      "acronym",
      "Exact uppercase bounded acronym and nonempty bounded caller full name required.",
    );
  literal(
    input.callerExactFirstUsePattern,
    ["full (short)", "short (full)"],
    "pattern",
  );
  codepoints(input.copyText);
  const re = new RegExp(
      `(?<![\\p{L}\\p{N}_])${input.acronymToken}(?![\\p{L}\\p{N}_])`,
      "gu",
    ),
    matches = [...input.copyText.matchAll(re)],
    first = matches[0]?.index ?? -1,
    expected =
      input.callerExactFirstUsePattern === "full (short)"
        ? `${input.callerFullName} (${input.acronymToken})`
        : `${input.acronymToken} (${input.callerFullName})`,
    start =
      input.callerExactFirstUsePattern === "full (short)"
        ? first - input.callerFullName.length - 2
        : first,
    pattern =
      first >= 0 &&
      start >= 0 &&
      input.copyText.slice(start, start + expected.length) === expected;
  return {
    firstAcronymCodepointOffset:
      first < 0 ? -1 : codepoints(input.copyText.slice(0, first)).length,
    firstUseExpansionPatternPresent: pattern,
    observedAcronymTokenCount: matches.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  copyText: "World Health Organization (WHO) works. WHO reports.",
  acronymToken: "WHO",
  callerFullName: "World Health Organization",
  callerExactFirstUsePattern: "full (short)",
} satisfies Input;
export const exampleOutput = {
  firstAcronymCodepointOffset: 27,
  firstUseExpansionPatternPresent: true,
  observedAcronymTokenCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/acronym-first-use-spelled-out-rule-checker",
  title: "Acronym First Use Spelled Out Rule Checker",
  description:
    "Audit exact caller acronym-token first-use expansion under one of two literal house-style forms, preserving Unicode codepoint position and avoiding embedded token matches; no invented acronym dictionary, contextual common-name exceptions or semantic expansion matching.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstAcronymCodepointOffset",
      label: "First acronym codepoint offset",
      kind: "number",
    },
    {
      id: "firstUseExpansionPatternPresent",
      label: "First use expansion pattern present",
      kind: "boolean",
    },
    {
      id: "observedAcronymTokenCount",
      label: "Observed acronym token count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      copyText: value.copyText as string,
      acronymToken: value.acronymToken as string,
      callerFullName: value.callerFullName as string,
      callerExactFirstUsePattern: value.callerExactFirstUsePattern as string,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSemanticHueKeys: readonly string[];
  readonly callerVerifiedSemanticHueNotices: readonly string[];
  readonly querySemanticHueKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedSemanticHueKeys",
    label: "Caller verified semantic hue keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSemanticHueNotices",
    label: "Caller verified semantic hue notices",
    kind: "stringList",
  },
  {
    id: "querySemanticHueKey",
    label: "Query semantic hue key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedSemanticHueKeys,
      input.callerVerifiedSemanticHueNotices,
      input.querySemanticHueKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedSemanticHueKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedSemanticHueNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  querySemanticHueKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/semantic-status-hue-standard-lookup",
  title: "Semantic Status Hue Standard Lookup",
  description:
    "Caller independently versioned design-system semantic status/hue mapping; warning/error/success hue is not universal or accessible without redundant cues. Exact independently verified context/edition key; not embedded or live reference data. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
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
      callerVerifiedSemanticHueKeys:
        value.callerVerifiedSemanticHueKeys as readonly string[],
      callerVerifiedSemanticHueNotices:
        value.callerVerifiedSemanticHueNotices as readonly string[],
      querySemanticHueKey: value.querySemanticHueKey as string,
    }),
});
export const run = tool.execute;
export default tool;

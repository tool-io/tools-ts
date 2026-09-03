import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedRichBlackKeys: readonly string[];
  readonly callerVerifiedRichBlackNotices: readonly string[];
  readonly queryRichBlackKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedRichBlackKeys",
    label: "Caller verified rich black keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedRichBlackNotices",
    label: "Caller verified rich black notices",
    kind: "stringList",
  },
  { id: "queryRichBlackKey", label: "Query rich black key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedRichBlackKeys,
      input.callerVerifiedRichBlackNotices,
      input.queryRichBlackKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedRichBlackKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedRichBlackNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryRichBlackKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/rich-black-composition-lookup",
  title: "Rich Black Composition Lookup",
  description:
    "Caller independently verified press/profile/substrate rich-black separation recipe notice; not universal CMYK build or printing ordinary artwork at registration 100%allinks. Exact independently verified context/edition key; not embedded or live reference data. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
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
      callerVerifiedRichBlackKeys:
        value.callerVerifiedRichBlackKeys as readonly string[],
      callerVerifiedRichBlackNotices:
        value.callerVerifiedRichBlackNotices as readonly string[],
      queryRichBlackKey: value.queryRichBlackKey as string,
    }),
});
export const run = tool.execute;
export default tool;

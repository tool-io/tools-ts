import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFlamencoPaloKeys: readonly string[];
  readonly callerVerifiedFlamencoPaloNotices: readonly string[];
  readonly queryFlamencoPaloKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedFlamencoPaloKeys",
    label: "Caller verified flamenco palo keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFlamencoPaloNotices",
    label: "Caller verified flamenco palo notices",
    kind: "stringList",
  },
  {
    id: "queryFlamencoPaloKey",
    label: "Query flamenco palo key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedFlamencoPaloKeys,
      input.callerVerifiedFlamencoPaloNotices,
      input.queryFlamencoPaloKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFlamencoPaloKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedFlamencoPaloNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryFlamencoPaloKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/flamenco-palo-rhythm-family-lookup",
  title: "Flamenco Palo Rhythm Family Lookup",
  description:
    "Caller independently community/source-verified flamenco palo/compás reference; rhythm families and naming are context-dependent. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedFlamencoPaloKeys:
        value.callerVerifiedFlamencoPaloKeys as readonly string[],
      callerVerifiedFlamencoPaloNotices:
        value.callerVerifiedFlamencoPaloNotices as readonly string[],
      queryFlamencoPaloKey: value.queryFlamencoPaloKey as string,
    }),
});
export const run = tool.execute;
export default tool;

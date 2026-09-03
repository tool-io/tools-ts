import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedBalletEraKeys: readonly string[];
  readonly callerVerifiedBalletEraNotices: readonly string[];
  readonly queryBalletEraKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedBalletEraKeys",
    label: "Caller verified ballet era keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedBalletEraNotices",
    label: "Caller verified ballet era notices",
    kind: "stringList",
  },
  { id: "queryBalletEraKey", label: "Query ballet era key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedBalletEraKeys,
      input.callerVerifiedBalletEraNotices,
      input.queryBalletEraKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedBalletEraKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedBalletEraNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryBalletEraKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/ballet-era-romantic-classical-neoclassical-contemporary-lookup",
  title: "Ballet Era Romantic Classical Neoclassical Contemporary Lookup",
  description:
    "Independently verified source/region repertory historical ballet-era reference, not rigid world wide chronology. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedBalletEraKeys:
        value.callerVerifiedBalletEraKeys as readonly string[],
      callerVerifiedBalletEraNotices:
        value.callerVerifiedBalletEraNotices as readonly string[],
      queryBalletEraKey: value.queryBalletEraKey as string,
    }),
});
export const run = tool.execute;
export default tool;

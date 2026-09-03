import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedCharacterShoeDimensionsKeys: readonly string[];
  readonly callerVerifiedCharacterShoeDimensionsNotices: readonly string[];
  readonly queryCharacterShoeDimensionsKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedCharacterShoeDimensionsKeys",
    label: "Caller verified character shoe dimensions keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedCharacterShoeDimensionsNotices",
    label: "Caller verified character shoe dimensions notices",
    kind: "stringList",
  },
  {
    id: "queryCharacterShoeDimensionsKey",
    label: "Query character shoe dimensions key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedCharacterShoeDimensionsKeys,
      input.callerVerifiedCharacterShoeDimensionsNotices,
      input.queryCharacterShoeDimensionsKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedCharacterShoeDimensionsKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedCharacterShoeDimensionsNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryCharacterShoeDimensionsKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/character-shoe-heel-height-style-lookup",
  title: "Character Shoe Heel Height Style Lookup",
  description:
    "Independently verified style/model fitter heel-height reference, not safe fit or universal dance style shoe. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedCharacterShoeDimensionsKeys:
        value.callerVerifiedCharacterShoeDimensionsKeys as readonly string[],
      callerVerifiedCharacterShoeDimensionsNotices:
        value.callerVerifiedCharacterShoeDimensionsNotices as readonly string[],
      queryCharacterShoeDimensionsKey:
        value.queryCharacterShoeDimensionsKey as string,
    }),
});
export const run = tool.execute;
export default tool;

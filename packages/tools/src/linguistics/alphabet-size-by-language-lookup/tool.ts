import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAlphabetLetterInventory: readonly string[];
}>;
export type Output = Readonly<{
  readonly declaredDistinctInventoryCount: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedAlphabetLetterInventory",
    label: "Caller verified alphabet letter inventory",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerVerifiedAlphabetLetterInventory, "inventory");
  return {
    declaredDistinctInventoryCount:
      input.callerVerifiedAlphabetLetterInventory.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAlphabetLetterInventory: ["a", "b", "c"],
} satisfies Input;
export const exampleOutput = {
  declaredDistinctInventoryCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/alphabet-size-by-language-lookup",
  title: "Alphabet Size By Language Lookup",
  description:
    "Caller explicit independently segmented alphabet inventory; multigraph letters must be supplied as single tokens, not count Unicode code points. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "declaredDistinctInventoryCount",
      label: "Declared distinct inventory count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedAlphabetLetterInventory:
        value.callerVerifiedAlphabetLetterInventory as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;

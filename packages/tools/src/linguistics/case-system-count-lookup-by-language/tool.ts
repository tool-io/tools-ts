import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedGrammaticalCaseInventory: readonly string[];
}>;
export type Output = Readonly<{
  readonly declaredDistinctInventoryCount: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedGrammaticalCaseInventory",
    label: "Caller verified grammatical case inventory",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerVerifiedGrammaticalCaseInventory, "inventory");
  return {
    declaredDistinctInventoryCount:
      input.callerVerifiedGrammaticalCaseInventory.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedGrammaticalCaseInventory: ["a", "b", "c"],
} satisfies Input;
export const exampleOutput = {
  declaredDistinctInventoryCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/case-system-count-lookup-by-language",
  title: "Case System Count By Language Lookup",
  description:
    "Caller explicit independently defined grammatical-case inventory for variety/method, syncretic spellings not merged by string equality. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedGrammaticalCaseInventory:
        value.callerVerifiedGrammaticalCaseInventory as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedVowelPhonemeInventory: readonly string[];
}>;
export type Output = Readonly<{
  readonly declaredDistinctInventoryCount: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedVowelPhonemeInventory",
    label: "Caller verified vowel phoneme inventory",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerVerifiedVowelPhonemeInventory, "inventory");
  return {
    declaredDistinctInventoryCount:
      input.callerVerifiedVowelPhonemeInventory.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedVowelPhonemeInventory: ["a", "b", "c"],
} satisfies Input;
export const exampleOutput = {
  declaredDistinctInventoryCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/vowel-inventory-size-band-lookup",
  title: "Vowel Inventory Size Band Lookup",
  description:
    "Caller independently analyzed vowel phoneme inventory, not allophonic phone/chart count. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedVowelPhonemeInventory:
        value.callerVerifiedVowelPhonemeInventory as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTotalPhonemeInventory: readonly string[];
}>;
export type Output = Readonly<{
  readonly declaredDistinctInventoryCount: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedTotalPhonemeInventory",
    label: "Caller verified total phoneme inventory",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerVerifiedTotalPhonemeInventory, "inventory");
  return {
    declaredDistinctInventoryCount:
      input.callerVerifiedTotalPhonemeInventory.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedTotalPhonemeInventory: ["a", "b", "c"],
} satisfies Input;
export const exampleOutput = {
  declaredDistinctInventoryCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/phoneme-total-count-estimate-by-language",
  title: "Total Phoneme Count Estimate By Language",
  description:
    "Caller independently analyzed complete phoneme inventory; no additive vowel/consonant double count or automatic linguistic analysis. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedTotalPhonemeInventory:
        value.callerVerifiedTotalPhonemeInventory as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;

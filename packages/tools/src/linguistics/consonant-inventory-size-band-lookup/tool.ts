import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedConsonantPhonemeInventory: readonly string[];
}>;
export type Output = Readonly<{
  readonly declaredDistinctInventoryCount: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedConsonantPhonemeInventory",
    label: "Caller verified consonant phoneme inventory",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerVerifiedConsonantPhonemeInventory, "inventory");
  return {
    declaredDistinctInventoryCount:
      input.callerVerifiedConsonantPhonemeInventory.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedConsonantPhonemeInventory: ["a", "b", "c"],
} satisfies Input;
export const exampleOutput = {
  declaredDistinctInventoryCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/consonant-inventory-size-band-lookup",
  title: "Consonant Inventory Size Band Lookup",
  description:
    "Caller independently analyzed consonant phoneme inventory including method-specific affricate segmentation. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedConsonantPhonemeInventory:
        value.callerVerifiedConsonantPhonemeInventory as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly classTokens: readonly string[];
  readonly callerIndependentlyVerifiedUtilityTokens: readonly string[];
}>;
export type Output = Readonly<{
  readonly callerUtilityFlags: readonly number[];
  readonly unclassifiedTokens: readonly string[];
}>;
const inputFields = [
  { id: "classTokens", label: "Class tokens", kind: "stringList" },
  {
    id: "callerIndependentlyVerifiedUtilityTokens",
    label: "Caller independently verified utility tokens",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerIndependentlyVerifiedUtilityTokens, "utility registry");
  return {
    callerUtilityFlags: input.classTokens.map((v) =>
      input.callerIndependentlyVerifiedUtilityTokens.includes(v) ? 1 : 0,
    ),
    unclassifiedTokens: input.classTokens.filter(
      (v) => !input.callerIndependentlyVerifiedUtilityTokens.includes(v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  classTokens: ["p-4", "button", "text-sm"],
  callerIndependentlyVerifiedUtilityTokens: ["p-4", "text-sm"],
} satisfies Input;
export const exampleOutput = {
  callerUtilityFlags: [1, 0, 1],
  unclassifiedTokens: ["button"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/utility-first-classifier-note",
  title: "Utility-First Class Classifier Note",
  description:
    "Audit exact caller framework/version utility registry, no utility-first identity inferred from class spelling or generated CSS availability. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerUtilityFlags",
      label: "Caller utility flags",
      kind: "numberList",
    },
    {
      id: "unclassifiedTokens",
      label: "Unclassified tokens",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      classTokens: value.classTokens as readonly string[],
      callerIndependentlyVerifiedUtilityTokens:
        value.callerIndependentlyVerifiedUtilityTokens as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;

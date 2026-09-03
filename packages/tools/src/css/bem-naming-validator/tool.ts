import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch40-shared.js";
export type Input = Readonly<{ readonly classTokens: readonly string[] }>;
export type Output = Readonly<{
  readonly validBemFlags: readonly number[];
  readonly invalidClassTokens: readonly string[];
}>;
const inputFields = [
  { id: "classTokens", label: "Class tokens", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.classTokens.some((v) => v.length > 128))
    simpleError("tokens", "Bounded individual plain class tokens.");
  const re =
    /^[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$/;
  const f = input.classTokens.map((v) => (re.test(v) ? 1 : 0));
  return {
    validBemFlags: f,
    invalidClassTokens: input.classTokens.filter((_, i) => !f[i]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  classTokens: ["button", "button__icon", "button--large", "Button"],
} satisfies Input;
export const exampleOutput = {
  validBemFlags: [1, 1, 1, 0],
  invalidClassTokens: ["Button"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/bem-naming-validator",
  title: "BEM Naming Validator",
  description:
    "Explicit lowercase hyphenated BEM dialect validator (optional element and modifier), not universal BEM convention or CSS identifier validity. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "validBemFlags", label: "Valid bem flags", kind: "numberList" },
    {
      id: "invalidClassTokens",
      label: "Invalid class tokens",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({ classTokens: value.classTokens as readonly string[] }),
});
export const run = tool.execute;
export default tool;

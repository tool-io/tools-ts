import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly independentlyFocused: boolean;
  readonly uaFocusVisibleMatch: boolean;
}>;
export type Output = Readonly<{
  readonly focusSelectorMatches: boolean;
  readonly focusVisibleSelectorMatches: boolean;
}>;
const inputFields = [
  {
    id: "independentlyFocused",
    label: "Independently focused",
    kind: "boolean",
  },
  {
    id: "uaFocusVisibleMatch",
    label: "Ua focus visible match",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    focusSelectorMatches: input.independentlyFocused,
    focusVisibleSelectorMatches:
      input.independentlyFocused && input.uaFocusVisibleMatch,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyFocused: true,
  uaFocusVisibleMatch: false,
} satisfies Input;
export const exampleOutput = {
  focusSelectorMatches: true,
  focusVisibleSelectorMatches: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/focus-visible-vs-focus-ring-lookup",
  title: ":focus-visible vs :focus Ring Difference",
  description:
    "Compare actual caller focus state and independently observed UA focus-visible match; input modality alone does not universally determine visibility. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "focusSelectorMatches",
      label: "Focus selector matches",
      kind: "boolean",
    },
    {
      id: "focusVisibleSelectorMatches",
      label: "Focus visible selector matches",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyFocused: value.independentlyFocused as boolean,
      uaFocusVisibleMatch: value.uaFocusVisibleMatch as boolean,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch40-shared.js";
export type Input = Readonly<{ readonly observedShorthand: string }>;
export type Output = Readonly<{
  readonly flexGrow: number;
  readonly flexShrink: number;
  readonly flexBasisToken: string;
}>;
const inputFields = [
  { id: "observedShorthand", label: "Observed shorthand", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.observedShorthand !== "none")
    simpleError("shorthand", "Exact supported shorthand token only.");
  return { flexGrow: 0, flexShrink: 0, flexBasisToken: "auto" };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { observedShorthand: "none" } satisfies Input;
export const exampleOutput = {
  flexGrow: 0,
  flexShrink: 0,
  flexBasisToken: "auto",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/flex-shorthand-none-expansion",
  title: "flex:none Shorthand Expansion",
  description:
    "Expand exact flex:none to0 0 auto, not zero basis or display:none. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "flexGrow", label: "Flex grow", kind: "number" },
    { id: "flexShrink", label: "Flex shrink", kind: "number" },
    { id: "flexBasisToken", label: "Flex basis token", kind: "string" },
  ],
  calculate: (value) =>
    calculate({ observedShorthand: value.observedShorthand as string }),
});
export const run = tool.execute;
export default tool;

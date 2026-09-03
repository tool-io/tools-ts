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
  if (input.observedShorthand !== "1")
    simpleError("shorthand", "Exact supported shorthand token only.");
  return { flexGrow: 1, flexShrink: 1, flexBasisToken: "0%" };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { observedShorthand: "1" } satisfies Input;
export const exampleOutput = {
  flexGrow: 1,
  flexShrink: 1,
  flexBasisToken: "0%",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/flex-shorthand-one-expansion",
  title: "flex:1 Shorthand Expansion",
  description:
    "Expand exact flex:1 shorthand as interoperably used by browsers; percentage0% differs from definite0 in indefinite containers. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
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

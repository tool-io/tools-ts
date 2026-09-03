import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, decodeTap } from "../batch36-shared.js";
export type Input = Readonly<{ readonly text: string }>;
export type Output = Readonly<{ readonly transformed: string }>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return { transformed: decodeTap(input.text) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { text: "22 2 8 0 7777" } satisfies Input;
export const exampleOutput = { transformed: "BAT S" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/multi-tap-phone-keypad-decode",
  title: "Multi-Tap Keypad Decoder",
  description:
    "Canonical multi-tap2–9,0-space single-space token notation. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [{ id: "transformed", label: "Transformed", kind: "string" }],
  calculate: (value) => calculate({ text: value.text as string }),
});
export const run = tool.execute;
export default tool;

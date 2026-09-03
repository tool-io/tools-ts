import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly writingMode: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "writingMode", label: "Writing mode", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.writingMode,
      {
        "horizontal-tb": "inline horizontal, block top-to-bottom",
        "vertical-rl": "inline vertical, block right-to-left",
        "vertical-lr": "inline vertical, block left-to-right",
      },
      "writingMode",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { writingMode: "vertical-rl" } satisfies Input;
export const exampleOutput = {
  meaning: "inline vertical, block right-to-left",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/writing-mode-vertical-rl-lookup",
  title: "writing-mode vertical-rl Orientation Lookup",
  description:
    "Supported writing-mode axis orientation independent from inline text direction; not already existing logical-side conversion. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ writingMode: value.writingMode as string }),
});
export const run = tool.execute;
export default tool;

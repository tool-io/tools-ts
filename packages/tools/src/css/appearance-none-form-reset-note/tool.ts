import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly appearance: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "appearance", label: "Appearance", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.appearance,
      {
        none: "removes native appearance while retaining element semantics and interactions",
        auto: "UA selects native appearance appropriate to element",
      },
      "appearance",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { appearance: "none" } satisfies Input;
export const exampleOutput = {
  meaning:
    "removes native appearance while retaining element semantics and interactions",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/appearance-none-form-reset-note",
  title: "appearance:none Form Reset Note",
  description:
    "appearance:none is not a complete CSS reset or semantic replacement; focus and accessibility must remain independently handled. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ appearance: value.appearance as string }),
});
export const run = tool.execute;
export default tool;

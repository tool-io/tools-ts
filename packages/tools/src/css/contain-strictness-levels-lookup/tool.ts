import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly contain: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "contain", label: "Contain", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.contain,
      {
        none: "no containment requested",
        layout: "layout containment",
        paint: "paint containment",
        size: "size containment in both dimensions",
        "inline-size": "inline-axis size containment",
        style: "style containment effects",
        content: "layout style paint containment",
        strict: "size layout style paint containment",
      },
      "contain",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { contain: "strict" } satisfies Input;
export const exampleOutput = {
  meaning: "size layout style paint containment",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/contain-strictness-levels-lookup",
  title: "contain Strictness Levels Lookup",
  description:
    "Supported containment keyword expansion; not style encapsulation or assumption that content stays visible outside paint bounds. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ contain: value.contain as string }),
});
export const run = tool.execute;
export default tool;

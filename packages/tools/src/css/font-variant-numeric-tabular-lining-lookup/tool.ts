import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly numericPolicy: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "numericPolicy", label: "Numeric policy", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.numericPolicy,
      {
        "tabular-lining": "tabular-nums lining-nums",
        "proportional-lining": "proportional-nums lining-nums",
        "tabular-oldstyle": "tabular-nums oldstyle-nums",
        "proportional-oldstyle": "proportional-nums oldstyle-nums",
      },
      "numericPolicy",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { numericPolicy: "tabular-lining" } satisfies Input;
export const exampleOutput = {
  meaning: "tabular-nums lining-nums",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/font-variant-numeric-tabular-lining-lookup",
  title: "font-variant-numeric Tabular/Lining Lookup",
  description:
    "Supported font-variant-numeric axis combinations; tabular advances vs lining glyph form are independent, font support external. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ numericPolicy: value.numericPolicy as string }),
});
export const run = tool.execute;
export default tool;

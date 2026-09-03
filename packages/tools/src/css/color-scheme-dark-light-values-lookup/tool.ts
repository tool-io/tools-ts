import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly colorScheme: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "colorScheme", label: "Color scheme", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.colorScheme,
      {
        normal: "no supported schemes asserted by this value",
        light: "supports light color-scheme rendering",
        dark: "supports dark color-scheme rendering",
        "light dark": "supports both in declared preference order",
        "only light": "supports light and forbids UA overriding the scheme",
      },
      "colorScheme",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { colorScheme: "light dark" } satisfies Input;
export const exampleOutput = {
  meaning: "supports both in declared preference order",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/color-scheme-dark-light-values-lookup",
  title: "color-scheme dark/light Values Lookup",
  description:
    "Supported color-scheme declarations influence UA native surfaces, not set authored foreground/background colors automatically. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ colorScheme: value.colorScheme as string }),
});
export const run = tool.execute;
export default tool;

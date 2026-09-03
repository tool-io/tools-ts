import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly invertedColors: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "invertedColors", label: "Inverted colors", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.invertedColors,
      {
        inverted: "media query observes display color inversion",
        none: "media query does not observe display inversion",
      },
      "invertedColors",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { invertedColors: "inverted" } satisfies Input;
export const exampleOutput = {
  meaning: "media query observes display color inversion",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/inverted-colors-media-lookup",
  title: "inverted-colors Media Lookup",
  description:
    "Supported inverted-colors observation, not invert() filter inference or dark-scheme classification. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ invertedColors: value.invertedColors as string }),
});
export const run = tool.execute;
export default tool;

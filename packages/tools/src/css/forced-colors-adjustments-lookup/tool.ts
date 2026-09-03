import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly forcedColors: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "forcedColors", label: "Forced colors", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.forcedColors,
      {
        active:
          "UA may substitute colors; use system colors and preserve visible boundaries",
        none: "forced-color mode not active",
      },
      "forcedColors",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { forcedColors: "active" } satisfies Input;
export const exampleOutput = {
  meaning:
    "UA may substitute colors; use system colors and preserve visible boundaries",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/forced-colors-adjustments-lookup",
  title: "forced-colors Adjustments Lookup",
  description:
    "Supported forced-colors observations; forced-color-adjust:none opt-out is not a universal accessibility improvement. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ forcedColors: value.forcedColors as string }),
});
export const run = tool.execute;
export default tool;

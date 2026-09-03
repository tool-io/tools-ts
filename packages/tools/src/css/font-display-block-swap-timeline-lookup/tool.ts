import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly fontDisplay: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "fontDisplay", label: "Font display", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.fontDisplay,
      {
        block: "short block period then infinite swap period",
        swap: "extremely small block period then infinite swap period",
        fallback: "extremely small block period then short swap period",
        optional: "extremely small block period and no swap period",
        auto: "UA-defined loading strategy",
      },
      "fontDisplay",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { fontDisplay: "swap" } satisfies Input;
export const exampleOutput = {
  meaning: "extremely small block period then infinite swap period",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/font-display-block-swap-timeline-lookup",
  title: "font-display Block/Swap Timeline Lookup",
  description:
    "Qualitative font-display periods, no fixed universal millisecond durations or network completion guarantee. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ fontDisplay: value.fontDisplay as string }),
});
export const run = tool.execute;
export default tool;

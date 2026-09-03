import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly textOrientation: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "textOrientation", label: "Text orientation", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.textOrientation,
      {
        mixed:
          "in vertical writing, orientation follows Unicode vertical-orientation behavior",
        upright:
          "in vertical writing, characters upright and used direction is ltr",
        sideways:
          "typographic characters laid out horizontally and line rotated",
      },
      "textOrientation",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { textOrientation: "upright" } satisfies Input;
export const exampleOutput = {
  meaning: "in vertical writing, characters upright and used direction is ltr",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/text-orientation-mixed-upright-lookup",
  title: "text-orientation mixed/upright Lookup",
  description:
    "Supported vertical text-orientation token semantics, not glyph/font support inference. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ textOrientation: value.textOrientation as string }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly hintedProperty: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "hintedProperty", label: "Hinted property", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.hintedProperty,
      {
        transform:
          "hint of upcoming transform change, may create applicable stacking/containing context early",
        opacity:
          "hint of upcoming opacity change, may create stacking context early",
        "scroll-position": "hint of upcoming scroll-position change",
        contents: "hint that contents may change",
      },
      "hintedProperty",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { hintedProperty: "transform" } satisfies Input;
export const exampleOutput = {
  meaning:
    "hint of upcoming transform change, may create applicable stacking/containing context early",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/will-change-hints-list-lookup",
  title: "will-change Hints Properties List",
  description:
    "Supported will-change hints with possible resource/stacking effects, not guaranteed compositing or performance improvement. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ hintedProperty: value.hintedProperty as string }),
});
export const run = tool.execute;
export default tool;

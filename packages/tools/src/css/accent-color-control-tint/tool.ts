import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly controlKind: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "controlKind", label: "Control kind", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.controlKind,
      {
        checkbox: "accent-color can tint supported native checkbox rendering",
        radio: "accent-color can tint supported native radio rendering",
        range: "accent-color can tint supported native range rendering",
        progress: "accent-color can tint supported native progress rendering",
      },
      "controlKind",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { controlKind: "checkbox" } satisfies Input;
export const exampleOutput = {
  meaning: "accent-color can tint supported native checkbox rendering",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/accent-color-control-tint",
  title: "accent-color Native Control Tint",
  description:
    "Supported native control accent-color targets; exact rendered parts/contrast remain UA-dependent, not arbitrary form styling. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ controlKind: value.controlKind as string }),
});
export const run = tool.execute;
export default tool;

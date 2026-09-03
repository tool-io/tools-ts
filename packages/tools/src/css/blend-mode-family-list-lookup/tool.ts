import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly blendMode: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "blendMode", label: "Blend mode", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.blendMode,
      {
        multiply: "separable darkening",
        screen: "separable lightening",
        overlay: "separable contrast",
        difference: "separable comparison",
        hue: "nonseparable hue",
        saturation: "nonseparable saturation",
        color: "nonseparable color",
        luminosity: "nonseparable luminosity",
        normal: "normal source-over compositing",
      },
      "blendMode",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { blendMode: "hue" } satisfies Input;
export const exampleOutput = { meaning: "nonseparable hue" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/blend-mode-family-list-lookup",
  title: "Blend Mode Family List Lookup",
  description:
    "Supported blend-function family classification, not arbitrary blend syntax or color-space conversion. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ blendMode: value.blendMode as string }),
});
export const run = tool.execute;
export default tool;

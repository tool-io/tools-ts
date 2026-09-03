import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly dynamicRange: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "dynamicRange", label: "Dynamic range", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.dynamicRange,
      {
        standard: "standard brightness/contrast and color-depth capability",
        high: "high brightness/contrast and color-depth capability reported",
      },
      "dynamicRange",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { dynamicRange: "high" } satisfies Input;
export const exampleOutput = {
  meaning: "high brightness/contrast and color-depth capability reported",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/dynamic-range-high-media-lookup",
  title: "dynamic-range:high Media Lookup",
  description:
    "Media dynamic-range capability token, not an assertion that an image is HDR or is displayed with particular luminance. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ dynamicRange: value.dynamicRange as string }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, rgb } from "../batch-shared.js";
export type Input = Readonly<{ readonly rgbChannels: readonly number[] }>;
export type Output = Readonly<{ readonly yiqGammaLuma: number }>;
const inputFields = [
  { id: "rgbChannels", label: "Rgb channels", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  rgb(input.rgbChannels);
  return {
    yiqGammaLuma:
      0.299 * input.rgbChannels[0] +
      0.587 * input.rgbChannels[1] +
      0.114 * input.rgbChannels[2],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { rgbChannels: [1, 0, 0] } satisfies Input;
export const exampleOutput = { yiqGammaLuma: 0.299 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/yiq-luma-value",
  title: "YIQ Luma Value Calculator",
  description:
    "Compute normalized YIQ gamma-domain luma, not linear-light luminance or accessibility contrast; caller RGB is encoded sRGB interpreted under this explicit legacy weight heuristic.",
  inputs: inputFields,
  outputs: [{ id: "yiqGammaLuma", label: "Yiq gamma luma", kind: "number" }],
  calculate: (value) =>
    calculate({ rgbChannels: value.rgbChannels as readonly number[] }),
});
export const run = tool.execute;
export default tool;

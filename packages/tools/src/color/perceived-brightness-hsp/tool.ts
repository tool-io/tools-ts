import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, rgb } from "../batch-shared.js";
export type Input = Readonly<{ readonly rgbChannels: readonly number[] }>;
export type Output = Readonly<{ readonly hspPerceivedBrightness: number }>;
const inputFields = [
  { id: "rgbChannels", label: "Rgb channels", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  rgb(input.rgbChannels);
  const [r, g, b] = input.rgbChannels;
  return {
    hspPerceivedBrightness: Math.sqrt(
      0.299 * r * r + 0.587 * g * g + 0.114 * b * b,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { rgbChannels: [1, 0, 0] } satisfies Input;
export const exampleOutput = {
  hspPerceivedBrightness: 0.5468089245796927,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/perceived-brightness-hsp",
  title: "Perceived Brightness HSP Calculator",
  description:
    "Compute normalized HSP heuristic brightness from gamma-encoded sRGB with fixed .299/.587/.114 squared weights; not relative luminance, WCAG contrast, or individual perception.",
  inputs: inputFields,
  outputs: [
    {
      id: "hspPerceivedBrightness",
      label: "Hsp perceived brightness",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ rgbChannels: value.rgbChannels as readonly number[] }),
});
export const run = tool.execute;
export default tool;

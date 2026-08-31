import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, rgb, ansiPalette } from "../batch-shared.js";
export type Input = Readonly<{ readonly rgbChannels: readonly number[] }>;
export type Output = Readonly<{
  readonly nearestAnsi256Index: number;
  readonly nearestPaletteRgb: readonly number[];
  readonly encodedRgbDistance: number;
}>;
const inputFields = [
  { id: "rgbChannels", label: "Rgb channels", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  rgb(input.rgbChannels);
  const palette = ansiPalette(),
    distances = palette.map((c) =>
      Math.hypot(...c.map((v, i) => v - input.rgbChannels[i])),
    ),
    index = distances.indexOf(Math.min(...distances));
  return {
    nearestAnsi256Index: index,
    nearestPaletteRgb: palette[index],
    encodedRgbDistance: distances[index],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { rgbChannels: [1, 0, 0] } satisfies Input;
export const exampleOutput = {
  nearestAnsi256Index: 9,
  nearestPaletteRgb: [1, 0, 0],
  encodedRgbDistance: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/ansi-terminal-256-index-from-rgb",
  title: "ANSI 256 Index From RGB",
  description:
    "Match encoded RGB by Euclidean channel distance to explicit canonical xterm 256 palette, first-index ties; terminal ANSI 0–15 are theme-dependent, so assigned index may not render the assumed palette on every terminal.",
  inputs: inputFields,
  outputs: [
    {
      id: "nearestAnsi256Index",
      label: "Nearest ansi256 index",
      kind: "number",
    },
    {
      id: "nearestPaletteRgb",
      label: "Nearest palette rgb",
      kind: "numberList",
    },
    { id: "encodedRgbDistance", label: "Encoded rgb distance", kind: "number" },
  ],
  calculate: (value) =>
    calculate({ rgbChannels: value.rgbChannels as readonly number[] }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, rgb, hex, quantize } from "../batch-shared.js";
export type Input = Readonly<{ readonly rgbChannels: readonly number[] }>;
export type Output = Readonly<{
  readonly webSafeRgb: readonly number[];
  readonly webSafeHex: string;
  readonly redMajorWebSafeIndex: number;
}>;
const inputFields = [
  { id: "rgbChannels", label: "Rgb channels", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  rgb(input.rgbChannels);
  const levels = input.rgbChannels.map((v) => quantize(v, 6));
  return {
    webSafeRgb: levels.map((v) => v / 5),
    webSafeHex: hex(levels.map((v) => v / 5)),
    redMajorWebSafeIndex: levels[0] * 36 + levels[1] * 6 + levels[2],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { rgbChannels: [1, 0.1, 0] } satisfies Input;
export const exampleOutput = {
  webSafeRgb: [1, 0.2, 0],
  webSafeHex: "#FF3300",
  redMajorWebSafeIndex: 186,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/web-safe-216-nearest-index",
  title: "Web-Safe 216 Nearest Index",
  description:
    "Quantize encoded normalized RGB to 6-level web-safe cube, half-up channel ties and explicit red-major index; legacy palette reduction, not modern browser display safety or perceptual nearest match.",
  inputs: inputFields,
  outputs: [
    { id: "webSafeRgb", label: "Web safe rgb", kind: "numberList" },
    { id: "webSafeHex", label: "Web safe hex", kind: "string" },
    {
      id: "redMajorWebSafeIndex",
      label: "Red major web safe index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ rgbChannels: value.rgbChannels as readonly number[] }),
});
export const run = tool.execute;
export default tool;

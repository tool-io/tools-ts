import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  hue,
  nonnegative,
  fraction,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly sourceHex: string;
  readonly lightnessPercent: number;
  readonly chromaValue: number;
  readonly hueDegrees: number;
  readonly alphaFraction: number;
}>;
export type Output = Readonly<{ readonly relativeColorCss: string }>;
const inputFields = [
  { id: "sourceHex", label: "Source hex", kind: "string" },
  { id: "lightnessPercent", label: "Lightness percent", kind: "number" },
  { id: "chromaValue", label: "Chroma value", kind: "number" },
  { id: "hueDegrees", label: "Hue degrees", kind: "number" },
  { id: "alphaFraction", label: "Alpha fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.chromaValue, "chromaValue");
  fraction(input.alphaFraction, "alphaFraction");
  if (!/^#[0-9A-Fa-f]{6}$(?![\s\S])/.test(input.sourceHex))
    simpleError(
      "source",
      "Exact six-digit HEX source required; no arbitrary CSS injection accepted.",
    );
  if (
    input.lightnessPercent < 0 ||
    input.lightnessPercent > 100 ||
    input.chromaValue > 1
  )
    simpleError("components", "Bounded explicit OKLCH components required.");
  const H = hue(input.hueDegrees);
  return {
    relativeColorCss: `oklch(from ${input.sourceHex.toUpperCase()} ${input.lightnessPercent}% ${input.chromaValue} ${H} / ${input.alphaFraction})`,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sourceHex: "#FF0000",
  lightnessPercent: 50,
  chromaValue: 0.2,
  hueDegrees: 30,
  alphaFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  relativeColorCss: "oklch(from #FF0000 50% 0.2 30 / 0.5)",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/css-relative-color-syntax-builder",
  title: "CSS Relative Color Syntax Builder",
  description:
    "Build injection-safe CSS relative-color syntax with a literal six-digit source and explicit substituted OKLCH channels; no CSS parser evaluation, browser support guarantee or statement that channels remain in gamut.",
  inputs: inputFields,
  outputs: [
    { id: "relativeColorCss", label: "Relative color css", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      sourceHex: value.sourceHex as string,
      lightnessPercent: value.lightnessPercent as number,
      chromaValue: value.chromaValue as number,
      hueDegrees: value.hueDegrees as number,
      alphaFraction: value.alphaFraction as number,
    }),
});
export const run = tool.execute;
export default tool;

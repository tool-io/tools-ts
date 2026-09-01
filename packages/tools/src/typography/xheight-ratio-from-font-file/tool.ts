import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fontMetrics } from "../shared.js";
export type Input = Readonly<{ readonly fontFileHex: string }>;
export type Output = Readonly<{
  readonly unitsPerEm: number;
  readonly nativeXHeightUnits: number;
  readonly xHeightRatio: number;
  readonly nativeXHeightAvailable: boolean;
}>;
const inputFields = [
  { id: "fontFileHex", label: "Font file hex", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const m = fontMetrics(input.fontFileHex);
  return {
    unitsPerEm: m.unitsPerEm,
    nativeXHeightUnits: m.xHeight,
    xHeightRatio: m.hasXHeight ? m.xHeight / m.unitsPerEm : 0,
    nativeXHeightAvailable: m.hasXHeight,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fontFileHex:
    "00010000000200200001000068656164000000000000002c000000364f532f320000000000000064000000600000000000000000000000005f0f3cf5000003e8000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001f40000000000000000",
} satisfies Input;
export const exampleOutput = {
  unitsPerEm: 1000,
  nativeXHeightUnits: 500,
  xHeightRatio: 0.5,
  nativeXHeightAvailable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/xheight-ratio-from-font-file",
  title: "x-Height Ratio From Font File",
  description:
    "Extract head.unitsPerEm and OS/2.sxHeight from caller hex standalone SFNT font bytes; absent/zero/old OS/2 x-height is explicitly unavailable, not guessed from cap height or a full font validity certification.",
  inputs: inputFields,
  outputs: [
    { id: "unitsPerEm", label: "Units per em", kind: "number" },
    {
      id: "nativeXHeightUnits",
      label: "Native x height units",
      kind: "number",
    },
    { id: "xHeightRatio", label: "X height ratio", kind: "number" },
    {
      id: "nativeXHeightAvailable",
      label: "Native x height available",
      kind: "boolean",
    },
  ],
  calculate: (value) => calculate({ fontFileHex: value.fontFileHex as string }),
});
export const run = tool.execute;
export default tool;

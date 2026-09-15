import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  simpleError,
  rgb3,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly callerAnsi16Srgb: readonly (readonly number[])[];
  readonly whiteBlendFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerAnsi16Srgb", label: "Caller ansi16 srgb", kind: "matrix" },
  { id: "whiteBlendFraction", label: "White blend fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  if (i.callerAnsi16Srgb.length !== 16)
    simpleError("palette", "Exactly 16 caller ANSI slots.");
  i.callerAnsi16Srgb.forEach(rgb3);
  fraction(i.whiteBlendFraction, "blend");
  return {
    pastelSrgbSlots: i.callerAnsi16Srgb.map((row) =>
      row.map((v) => v + (1 - v) * i.whiteBlendFraction),
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    callerAnsi16Srgb: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    whiteBlendFraction: 0.5,
  },
  output: {
    result: {
      pastelSrgbSlots: [
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/terminal-ansi-16-pastel-theme-generator",
  title: "Terminal ANSI-16 Pastel Theme Generator",
  description:
    "Transform all sixteen caller ANSI palette slots by encoded white blend, no hidden default theme or automatic contrast guarantee.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

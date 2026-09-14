import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  sum,
  rgb3,
  srgbLinear,
  srgbEncode,
} from "../batch52-shared.js";
export type Input = Readonly<{ readonly encodedSrgb: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "encodedSrgb", label: "Encoded srgb", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  rgb3(i.encodedSrgb);
  const y = sum(
      i.encodedSrgb.map((v, j) => srgbLinear(v) * [0.2126, 0.7152, 0.0722][j]),
    ),
    gray = srgbEncode(y);
  return { relativeLuminance: y, encodedGraySrgb: [gray, gray, gray] };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { encodedSrgb: [1, 1, 1] },
  output: { result: { relativeLuminance: 1, encodedGraySrgb: [1, 1, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/grayscale-luminance-weighted-converter",
  title: "Luminance-Weighted Grayscale Converter",
  description:
    "D65 sRGB linear-light luminance to encoded achromatic RGB; not an achromatopsia clinical simulation.",
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

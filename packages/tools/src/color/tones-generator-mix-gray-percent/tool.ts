import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, rgb, fraction } from "../batch-shared.js";
export type Input = Readonly<{
  readonly baseRgb: readonly number[];
  readonly grayEncodedLevel: number;
  readonly toneFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly toneRgbRows: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "baseRgb", label: "Base rgb", kind: "numberList" },
  { id: "grayEncodedLevel", label: "Gray encoded level", kind: "number" },
  { id: "toneFractions", label: "Tone fractions", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.grayEncodedLevel, "grayEncodedLevel");
  rgb(input.baseRgb);
  if (!input.toneFractions.length || input.toneFractions.length > 128)
    simpleError("tones", "1–128 explicit tone fractions required.");
  input.toneFractions.forEach((v) => fraction(v, "tone"));
  return {
    toneRgbRows: input.toneFractions.map((t) =>
      input.baseRgb.map((v) => v * (1 - t) + input.grayEncodedLevel * t),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseRgb: [1, 0, 0],
  grayEncodedLevel: 0.5,
  toneFractions: [0, 0.5, 1],
} satisfies Input;
export const exampleOutput = {
  toneRgbRows: [
    [1, 0, 0],
    [0.75, 0.25, 0.25],
    [0.5, 0.5, 0.5],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/tones-generator-mix-gray-percent",
  title: "Tones Generator Mix Gray Percent",
  description:
    "Construct gamma-sRGB tone ladder toward caller neutral gray rather than assuming 50% gray, with explicit fractions; not subtractive ink or paint mixing.",
  inputs: inputFields,
  outputs: [{ id: "toneRgbRows", label: "Tone rgb rows", kind: "matrix" }],
  calculate: (value) =>
    calculate({
      baseRgb: value.baseRgb as readonly number[],
      grayEncodedLevel: value.grayEncodedLevel as number,
      toneFractions: value.toneFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

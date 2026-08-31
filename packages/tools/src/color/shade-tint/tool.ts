import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, rgb, fraction } from "../batch-shared.js";
export type Input = Readonly<{
  readonly baseRgb: readonly number[];
  readonly mixFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly tintRgbRows: readonly (readonly number[])[];
  readonly shadeRgbRows: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "baseRgb", label: "Base rgb", kind: "numberList" },
  { id: "mixFractions", label: "Mix fractions", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  rgb(input.baseRgb);
  if (!input.mixFractions.length || input.mixFractions.length > 128)
    simpleError("fractions", "1–128 paired tint/shade steps required.");
  input.mixFractions.forEach((v) => fraction(v, "mixFraction"));
  return {
    tintRgbRows: input.mixFractions.map((t) =>
      input.baseRgb.map((v) => v * (1 - t) + t),
    ),
    shadeRgbRows: input.mixFractions.map((t) =>
      input.baseRgb.map((v) => v * (1 - t)),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseRgb: [1, 0, 0],
  mixFractions: [0, 0.5, 1],
} satisfies Input;
export const exampleOutput = {
  tintRgbRows: [
    [1, 0, 0],
    [1, 0.5, 0.5],
    [1, 1, 1],
  ],
  shadeRgbRows: [
    [1, 0, 0],
    [0.5, 0, 0],
    [0, 0, 0],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/shade-tint",
  title: "Color Shade and Tint Generator",
  description:
    "Generate paired white-tint/black-shade RGB ladders at actual caller fractions in gamma-encoded sRGB; unlike scalar blend this constructs two coordinated bounded schedules. Not pigment mixing or perceptually uniform steps.",
  inputs: inputFields,
  outputs: [
    { id: "tintRgbRows", label: "Tint rgb rows", kind: "matrix" },
    { id: "shadeRgbRows", label: "Shade rgb rows", kind: "matrix" },
  ],
  calculate: (value) =>
    calculate({
      baseRgb: value.baseRgb as readonly number[],
      mixFractions: value.mixFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

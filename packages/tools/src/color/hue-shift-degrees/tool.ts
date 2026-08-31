import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, hsl, fromHsl, hue } from "../batch-shared.js";
export type Input = Readonly<{
  readonly baseRgb: readonly number[];
  readonly signedHueShiftDegrees: number;
}>;
export type Output = Readonly<{
  readonly rotatedHsl: readonly number[];
  readonly rotatedRgb: readonly number[];
  readonly chromaticHueEvidencePresent: boolean;
}>;
const inputFields = [
  { id: "baseRgb", label: "Base rgb", kind: "numberList" },
  {
    id: "signedHueShiftDegrees",
    label: "Signed hue shift degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = hsl(input.baseRgb),
    H = hue(v[0] + hue(input.signedHueShiftDegrees));
  return {
    rotatedHsl: [H, v[1], v[2]],
    rotatedRgb: fromHsl(H, v[1], v[2]),
    chromaticHueEvidencePresent: v[1] > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseRgb: [1, 0, 0],
  signedHueShiftDegrees: 120,
} satisfies Input;
export const exampleOutput = {
  rotatedHsl: [120, 1, 0.5],
  rotatedRgb: [0, 1, 0],
  chromaticHueEvidencePresent: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/hue-shift-degrees",
  title: "Hue Shift Degrees Tool",
  description:
    "Rotate actual RGB hue through HSL while preserving saturation/lightness; this is not CSS hue-rotate matrix equivalence and achromatic hue evidence stays absent.",
  inputs: inputFields,
  outputs: [
    { id: "rotatedHsl", label: "Rotated hsl", kind: "numberList" },
    { id: "rotatedRgb", label: "Rotated rgb", kind: "numberList" },
    {
      id: "chromaticHueEvidencePresent",
      label: "Chromatic hue evidence present",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      baseRgb: value.baseRgb as readonly number[],
      signedHueShiftDegrees: value.signedHueShiftDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;

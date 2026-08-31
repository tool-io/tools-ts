import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, hue, lab } from "../batch-shared.js";
export type Input = Readonly<{ readonly labComponents: readonly number[] }>;
export type Output = Readonly<{
  readonly lchComponents: readonly number[];
  readonly chromaticHueAvailable: boolean;
}>;
const inputFields = [
  { id: "labComponents", label: "Lab components", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  lab(input.labComponents);
  const [L, a, b] = input.labComponents,
    C = Math.hypot(a, b),
    H = C === 0 ? 0 : hue((Math.atan2(b, a) * 180) / Math.PI);
  return { lchComponents: [L, C, H], chromaticHueAvailable: C > 0 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { labComponents: [50, 3, 4] } satisfies Input;
export const exampleOutput = {
  lchComponents: [50, 5, 53.13010235415598],
  chromaticHueAvailable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/lab-lch-components-from-lab",
  title: "LCH Components From LAB Converter",
  description:
    "Convert caller same-reference CIELAB axes to polar CIELCH with [0,360) hue; neutral hue uses zero sentinel with unavailable flag, not a misleading hue assignment or RGB/OKLCH converter.",
  inputs: inputFields,
  outputs: [
    { id: "lchComponents", label: "Lch components", kind: "numberList" },
    {
      id: "chromaticHueAvailable",
      label: "Chromatic hue available",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({ labComponents: value.labComponents as readonly number[] }),
});
export const run = tool.execute;
export default tool;

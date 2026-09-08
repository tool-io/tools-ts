import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedCssFontPx: number;
  readonly independentlyBoldForWcag: boolean;
}>;
export type Output = Readonly<{
  readonly wcagLargeTextSizeScreen: boolean;
  readonly requiredCssPxForDeclaredWeight: number;
}>;
const inputFields = [
  { id: "observedCssFontPx", label: "Observed css font px", kind: "number" },
  {
    id: "independentlyBoldForWcag",
    label: "Independently bold for wcag",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedCssFontPx, "observedCssFontPx");
  const limit = input.independentlyBoldForWcag ? 56 / 3 : 24;
  return {
    wcagLargeTextSizeScreen: input.observedCssFontPx >= limit,
    requiredCssPxForDeclaredWeight: limit,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCssFontPx: 24,
  independentlyBoldForWcag: false,
} satisfies Input;
export const exampleOutput = {
  wcagLargeTextSizeScreen: true,
  requiredCssPxForDeclaredWeight: 24,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/large-text-threshold-18pt-24px-classifier",
  title: "Large Text 18pt/24px Threshold Classifier",
  description:
    "WCAG2 xlarge-text size category 18 pt=24 CSS pxor 14 ptbold=56/3 px; independent bold applicability, no physical PPI conversion or complete WCAG conformance. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "wcagLargeTextSizeScreen",
      label: "Wcag large text size screen",
      kind: "boolean",
    },
    {
      id: "requiredCssPxForDeclaredWeight",
      label: "Required css px for declared weight",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCssFontPx: value.observedCssFontPx as number,
      independentlyBoldForWcag: value.independentlyBoldForWcag as boolean,
    }),
});
export const run = tool.execute;
export default tool;

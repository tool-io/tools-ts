import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly targetAscentUnits: number;
  readonly targetDescentMagnitudeUnits: number;
  readonly targetLineGapUnits: number;
  readonly targetUnitsPerEm: number;
  readonly fallbackSizeAdjustFraction: number;
}>;
export type Output = Readonly<{
  readonly cssAscentOverridePercent: number;
  readonly cssDescentOverridePercent: number;
  readonly cssLineGapOverridePercent: number;
}>;
const inputFields = [
  { id: "targetAscentUnits", label: "Target ascent units", kind: "number" },
  {
    id: "targetDescentMagnitudeUnits",
    label: "Target descent magnitude units",
    kind: "number",
  },
  { id: "targetLineGapUnits", label: "Target line gap units", kind: "number" },
  { id: "targetUnitsPerEm", label: "Target units per em", kind: "number" },
  {
    id: "fallbackSizeAdjustFraction",
    label: "Fallback size adjust fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.targetUnitsPerEm, "targetUnitsPerEm");
  positive(input.fallbackSizeAdjustFraction, "fallbackSizeAdjustFraction");
  nonnegative(input.targetAscentUnits, "targetAscentUnits");
  nonnegative(input.targetDescentMagnitudeUnits, "targetDescentMagnitudeUnits");
  nonnegative(input.targetLineGapUnits, "targetLineGapUnits");
  const scale = 100 / input.targetUnitsPerEm / input.fallbackSizeAdjustFraction;
  return {
    cssAscentOverridePercent: input.targetAscentUnits * scale,
    cssDescentOverridePercent: input.targetDescentMagnitudeUnits * scale,
    cssLineGapOverridePercent: input.targetLineGapUnits * scale,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetAscentUnits: 800,
  targetDescentMagnitudeUnits: 200,
  targetLineGapUnits: 100,
  targetUnitsPerEm: 1000,
  fallbackSizeAdjustFraction: 1.25,
} satisfies Input;
export const exampleOutput = {
  cssAscentOverridePercent: 64,
  cssDescentOverridePercent: 16,
  cssLineGapOverridePercent: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/fallback-font-metrics-override-ascent-descent",
  title: "Fallback Metrics Ascent/Descent Override",
  description:
    "Resolve fallback ascent/descent/line-gap override percentages after separately supplied size-adjust scaling, so final layout metrics match target; no duplicate single ascent/descent alias or browser support guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "cssAscentOverridePercent",
      label: "Css ascent override percent",
      kind: "number",
    },
    {
      id: "cssDescentOverridePercent",
      label: "Css descent override percent",
      kind: "number",
    },
    {
      id: "cssLineGapOverridePercent",
      label: "Css line gap override percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      targetAscentUnits: value.targetAscentUnits as number,
      targetDescentMagnitudeUnits: value.targetDescentMagnitudeUnits as number,
      targetLineGapUnits: value.targetLineGapUnits as number,
      targetUnitsPerEm: value.targetUnitsPerEm as number,
      fallbackSizeAdjustFraction: value.fallbackSizeAdjustFraction as number,
    }),
});
export const run = tool.execute;
export default tool;

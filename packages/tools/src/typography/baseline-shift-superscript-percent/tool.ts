import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedBaseFontSizePoints: number;
  readonly callerSuperscriptBaselineRisePercent: number;
}>;
export type Output = Readonly<{
  readonly callerSuperscriptBaselineRisePoints: number;
}>;
const inputFields = [
  {
    id: "observedBaseFontSizePoints",
    label: "Observed base font size points",
    kind: "number",
  },
  {
    id: "callerSuperscriptBaselineRisePercent",
    label: "Caller superscript baseline rise percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedBaseFontSizePoints, "observedBaseFontSizePoints");
  return {
    callerSuperscriptBaselineRisePoints:
      (input.observedBaseFontSizePoints *
        input.callerSuperscriptBaselineRisePercent) /
      100,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBaseFontSizePoints: 12,
  callerSuperscriptBaselineRisePercent: 30,
} satisfies Input;
export const exampleOutput = {
  callerSuperscriptBaselineRisePoints: 3.6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/baseline-shift-superscript-percent",
  title: "Baseline Shift Superscript Percent",
  description:
    "Apply a caller font-specific superscript baseline-rise percentage to the base point size, retaining signed shifts. Not a universal glyph metric, exponent em conversion or shaping engine.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerSuperscriptBaselineRisePoints",
      label: "Caller superscript baseline rise points",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBaseFontSizePoints: value.observedBaseFontSizePoints as number,
      callerSuperscriptBaselineRisePercent:
        value.callerSuperscriptBaselineRisePercent as number,
    }),
});
export const run = tool.execute;
export default tool;

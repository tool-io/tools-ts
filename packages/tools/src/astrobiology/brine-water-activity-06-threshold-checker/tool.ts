import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredWaterActivity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredWaterActivity",
    label: "Independently measured water activity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.independentlyMeasuredWaterActivity, "aw");
  return {
    atOrAboveNominalPointSix: input.independentlyMeasuredWaterActivity >= 0.6,
    signedNominalMargin: input.independentlyMeasuredWaterActivity - 0.6,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyMeasuredWaterActivity: 0.7 },
  output: {
    result: { atOrAboveNominalPointSix: true, signedNominalMargin: 0.1 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/brine-water-activity-06-threshold-checker",
  title: "Brine Water Activity aw Habitability Threshold 0.6 Checker",
  description:
    "Measured awcomparison with explicitly nominal0.6reference; temperature, solute, organism and measurement uncertainty matter. Not a universal viability threshold or prove liquid water supports life.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

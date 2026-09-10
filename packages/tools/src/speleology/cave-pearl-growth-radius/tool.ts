import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualInitialPearlRadiusMm: number;
  readonly callerIndependentlyMeasuredRadialGrowthMmPerYear: number;
  readonly actualElapsedYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInitialPearlRadiusMm",
    label: "Actual initial pearl radius mm",
    kind: "number",
  },
  {
    id: "callerIndependentlyMeasuredRadialGrowthMmPerYear",
    label: "Caller independently measured radial growth mm per year",
    kind: "number",
  },
  { id: "actualElapsedYears", label: "Actual elapsed years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualInitialPearlRadiusMm, "radius");
  nonnegative(input.callerIndependentlyMeasuredRadialGrowthMmPerYear, "growth");
  nonnegative(input.actualElapsedYears, "time");
  return {
    conditionalPearlRadiusMm:
      input.actualInitialPearlRadiusMm +
      input.callerIndependentlyMeasuredRadialGrowthMmPerYear *
        input.actualElapsedYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInitialPearlRadiusMm: 2,
    callerIndependentlyMeasuredRadialGrowthMmPerYear: 0.5,
    actualElapsedYears: 2,
  },
  output: { result: { conditionalPearlRadiusMm: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/cave-pearl-growth-radius",
  title: "Cave Pearl Nucleation Radius Growth Calculator",
  description:
    "Conditional existing cave pearl radius plus matched independently observed constant radial growth\u00d7time. Does not infer nucleation threshold, nucleation process or observed future radius.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

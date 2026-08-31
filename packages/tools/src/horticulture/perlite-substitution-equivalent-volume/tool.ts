import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly removedPerliteLooseLiters: number;
  readonly callerMeasuredPerliteSettledContributionFraction: number;
  readonly callerMeasuredAlternativeSettledContributionFraction: number;
}>;
export type Output = Readonly<{
  readonly requiredAlternativeLooseLiters: number;
  readonly modeledMatchedSettledContributionLiters: number;
}>;
const inputFields = [
  {
    id: "removedPerliteLooseLiters",
    label: "Removed perlite loose liters",
    kind: "number",
  },
  {
    id: "callerMeasuredPerliteSettledContributionFraction",
    label: "Caller measured perlite settled contribution fraction",
    kind: "number",
  },
  {
    id: "callerMeasuredAlternativeSettledContributionFraction",
    label: "Caller measured alternative settled contribution fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMeasuredPerliteSettledContributionFraction,
    "callerMeasuredPerliteSettledContributionFraction",
  );
  positive(
    input.callerMeasuredAlternativeSettledContributionFraction,
    "callerMeasuredAlternativeSettledContributionFraction",
  );
  nonnegative(input.removedPerliteLooseLiters, "removedPerliteLooseLiters");
  fraction(
    input.callerMeasuredPerliteSettledContributionFraction,
    "callerMeasuredPerliteSettledContributionFraction",
  );
  fraction(
    input.callerMeasuredAlternativeSettledContributionFraction,
    "callerMeasuredAlternativeSettledContributionFraction",
  );
  const settled =
    input.removedPerliteLooseLiters *
    input.callerMeasuredPerliteSettledContributionFraction;
  return {
    requiredAlternativeLooseLiters:
      settled / input.callerMeasuredAlternativeSettledContributionFraction,
    modeledMatchedSettledContributionLiters: settled,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  removedPerliteLooseLiters: 10,
  callerMeasuredPerliteSettledContributionFraction: 0.8,
  callerMeasuredAlternativeSettledContributionFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  requiredAlternativeLooseLiters: 16,
  modeledMatchedSettledContributionLiters: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/perlite-substitution-equivalent-volume",
  title: "Perlite Substitution Equivalent Volume Calculator",
  description:
    "Match actual perlite/alternative measured settled-volume contributions under explicit independent calibrations; not equal loose-volume substitute, pore/chemical equivalence or repeated three-ingredient blend.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredAlternativeLooseLiters",
      label: "Required alternative loose liters",
      kind: "number",
    },
    {
      id: "modeledMatchedSettledContributionLiters",
      label: "Modeled matched settled contribution liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      removedPerliteLooseLiters: value.removedPerliteLooseLiters as number,
      callerMeasuredPerliteSettledContributionFraction:
        value.callerMeasuredPerliteSettledContributionFraction as number,
      callerMeasuredAlternativeSettledContributionFraction:
        value.callerMeasuredAlternativeSettledContributionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;

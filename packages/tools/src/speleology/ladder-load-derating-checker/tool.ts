import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerManufacturerApplicableOriginalRatingNewtons: number;
  readonly callerQualifiedDeratingFraction: number;
  readonly actualIndependentlyAssessedDemandNewtons: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerManufacturerApplicableOriginalRatingNewtons",
    label: "Caller manufacturer applicable original rating newtons",
    kind: "number",
  },
  {
    id: "callerQualifiedDeratingFraction",
    label: "Caller qualified derating fraction",
    kind: "number",
  },
  {
    id: "actualIndependentlyAssessedDemandNewtons",
    label: "Actual independently assessed demand newtons",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerManufacturerApplicableOriginalRatingNewtons, "rating");
  fraction(input.callerQualifiedDeratingFraction, "factor");
  nonnegative(input.actualIndependentlyAssessedDemandNewtons, "demand");
  const r =
    input.callerManufacturerApplicableOriginalRatingNewtons *
    input.callerQualifiedDeratingFraction;
  return {
    conditionalDeratedRatingNewtons: r,
    signedRatingMinusDemandNewtons:
      r - input.actualIndependentlyAssessedDemandNewtons,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerManufacturerApplicableOriginalRatingNewtons: 100,
    callerQualifiedDeratingFraction: 0.5,
    actualIndependentlyAssessedDemandNewtons: 60,
  },
  output: {
    result: {
      conditionalDeratedRatingNewtons: 50,
      signedRatingMinusDemandNewtons: -10,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/ladder-load-derating-checker",
  title: "Wire Ladder Load Rating Derating Checker",
  description:
    "Manufacturer/competent-review independently established ladder rating\u00d7derating factor minus actual demand, not select a factor or declare compliant/safe ladder. Dynamic loads, condition and system ratings external.",
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

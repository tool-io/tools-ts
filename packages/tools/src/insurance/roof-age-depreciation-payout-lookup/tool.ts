import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
  money,
  share,
  rating,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedRoofAgeYears: number;
  readonly callerRoofAgeLowerEdgesYears: readonly number[];
  readonly callerVerifiedDepreciationBasisPoints: readonly number[];
  readonly callerRoofReplacementMinor: number;
  readonly callerRoofDeductibleMinor: number;
}>;
export type Output = Readonly<{
  readonly callerRoofDepreciationMinor: number;
  readonly callerModeledRoofAcvAfterDeductibleMinor: number;
}>;
const inputFields = [
  {
    id: "observedRoofAgeYears",
    label: "Observed roof age years",
    kind: "number",
  },
  {
    id: "callerRoofAgeLowerEdgesYears",
    label: "Caller roof age lower edges years",
    kind: "numberList",
  },
  {
    id: "callerVerifiedDepreciationBasisPoints",
    label: "Caller verified depreciation basis points",
    kind: "numberList",
  },
  {
    id: "callerRoofReplacementMinor",
    label: "Caller roof replacement minor",
    kind: "number",
  },
  {
    id: "callerRoofDeductibleMinor",
    label: "Caller roof deductible minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedRoofAgeYears, "age");
  money(input.callerRoofReplacementMinor);
  money(input.callerRoofDeductibleMinor);
  input.callerVerifiedDepreciationBasisPoints.forEach((v) =>
    bounded(v, "bps", 0, 10000),
  );
  const depreciation = share(
    input.callerRoofReplacementMinor,
    rating(
      input.observedRoofAgeYears,
      input.callerRoofAgeLowerEdgesYears,
      input.callerVerifiedDepreciationBasisPoints,
    ),
  );
  return {
    callerRoofDepreciationMinor: depreciation,
    callerModeledRoofAcvAfterDeductibleMinor: Math.max(
      0,
      input.callerRoofReplacementMinor -
        depreciation -
        input.callerRoofDeductibleMinor,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRoofAgeYears: 15,
  callerRoofAgeLowerEdgesYears: [0, 10, 20],
  callerVerifiedDepreciationBasisPoints: [0, 2000, 5000],
  callerRoofReplacementMinor: 10000,
  callerRoofDeductibleMinor: 1000,
} satisfies Input;
export const exampleOutput = {
  callerRoofDepreciationMinor: 2000,
  callerModeledRoofAcvAfterDeductibleMinor: 7000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/roof-age-depreciation-payout-lookup",
  title: "Roof Age Depreciation Payout Lookup",
  description:
    "Read actual roof age through independently verified material/policy depreciation schedule, apply caller replacement/deductible order; not generic life depreciation or legal ACV valuation.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerRoofDepreciationMinor",
      label: "Caller roof depreciation minor",
      kind: "number",
    },
    {
      id: "callerModeledRoofAcvAfterDeductibleMinor",
      label: "Caller modeled roof acv after deductible minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRoofAgeYears: value.observedRoofAgeYears as number,
      callerRoofAgeLowerEdgesYears:
        value.callerRoofAgeLowerEdgesYears as readonly number[],
      callerVerifiedDepreciationBasisPoints:
        value.callerVerifiedDepreciationBasisPoints as readonly number[],
      callerRoofReplacementMinor: value.callerRoofReplacementMinor as number,
      callerRoofDeductibleMinor: value.callerRoofDeductibleMinor as number,
    }),
});
export const run = tool.execute;
export default tool;

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
  readonly actualUncorrectedHeliumAgeYears: number;
  readonly callerIndependentAlphaRetentionFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualUncorrectedHeliumAgeYears",
    label: "Actual uncorrected helium age years",
    kind: "number",
  },
  {
    id: "callerIndependentAlphaRetentionFraction",
    label: "Caller independent alpha retention fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualUncorrectedHeliumAgeYears, "age");
  fraction(input.callerIndependentAlphaRetentionFraction, "retention");
  positive(input.callerIndependentAlphaRetentionFraction, "retention");
  return {
    conditionalAlphaEjectionCorrectedAgeYears:
      input.actualUncorrectedHeliumAgeYears /
      input.callerIndependentAlphaRetentionFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualUncorrectedHeliumAgeYears: 100,
    callerIndependentAlphaRetentionFraction: 0.8,
  },
  output: { result: { conditionalAlphaEjectionCorrectedAgeYears: 125 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/helium-age-correction-alpha-ejection",
  title: "Geology Helium Age Correction Alpha Ejection Calculator",
  description:
    "Simple independent FTalpha-retention division age/FT, not derive FTfrom grain shape, correct zoning/diffusion or resolve parent/helium production.",
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

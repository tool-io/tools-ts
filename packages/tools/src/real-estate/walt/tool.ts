import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  weightedMean,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyApplicableRemainingLeaseTermsYears: readonly number[];
  readonly actualLeaseRentWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyApplicableRemainingLeaseTermsYears",
    label: "Actual independently applicable remaining lease terms years",
    kind: "numberList",
  },
  {
    id: "actualLeaseRentWeights",
    label: "Actual lease rent weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentlyApplicableRemainingLeaseTermsYears.length)
    simpleError(
      "actualIndependentlyApplicableRemainingLeaseTermsYears",
      "Actual nonempty observations.",
    );
  input.actualIndependentlyApplicableRemainingLeaseTermsYears.forEach((v) =>
    nonnegative(v, "actualIndependentlyApplicableRemainingLeaseTermsYears"),
  );
  if (!input.actualLeaseRentWeights.length)
    simpleError("actualLeaseRentWeights", "Actual nonempty observations.");
  input.actualLeaseRentWeights.forEach((v) =>
    nonnegative(v, "actualLeaseRentWeights"),
  );
  return {
    value: weightedMean(
      input.actualIndependentlyApplicableRemainingLeaseTermsYears,
      input.actualLeaseRentWeights,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyApplicableRemainingLeaseTermsYears: [1, 3],
    actualLeaseRentWeights: [1, 1],
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/walt",
  title: "Weighted Average Lease Term Calculator",
  description:
    "Rent weighted average independently applicable remaining lease years terms, WALT. Break/exercise/expirydefinition externally resolved; not future expectedrenewals.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

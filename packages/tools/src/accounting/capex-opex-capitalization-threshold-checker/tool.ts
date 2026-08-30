import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly expenditureMinor: number;
  readonly callerCapitalizationThresholdMinor: number;
  readonly expectedBenefitMonths: number;
  readonly callerMinimumBenefitMonths: number;
  readonly callerRecognitionEvidenceSatisfied: boolean;
}>;
export type Output = Readonly<{
  readonly meetsCallerAmountThreshold: boolean;
  readonly meetsCallerBenefitHorizon: boolean;
  readonly capitalizationCandidateUnderCallerPolicy: boolean;
}>;
const inputFields = [
  { id: "expenditureMinor", label: "Expenditure minor", kind: "number" },
  {
    id: "callerCapitalizationThresholdMinor",
    label: "Caller capitalization threshold minor",
    kind: "number",
  },
  {
    id: "expectedBenefitMonths",
    label: "Expected benefit months",
    kind: "number",
  },
  {
    id: "callerMinimumBenefitMonths",
    label: "Caller minimum benefit months",
    kind: "number",
  },
  {
    id: "callerRecognitionEvidenceSatisfied",
    label: "Caller recognition evidence satisfied",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.expenditureMinor, "expenditureMinor");
  money(
    input.callerCapitalizationThresholdMinor,
    "callerCapitalizationThresholdMinor",
  );
  bounded(input.expectedBenefitMonths, "benefitMonths", 0, 1200);
  bounded(input.callerMinimumBenefitMonths, "policyMonths", 1, 1200);
  const amount =
      input.expenditureMinor >= input.callerCapitalizationThresholdMinor,
    horizon = input.expectedBenefitMonths >= input.callerMinimumBenefitMonths;
  return {
    meetsCallerAmountThreshold: amount,
    meetsCallerBenefitHorizon: horizon,
    capitalizationCandidateUnderCallerPolicy:
      amount && horizon && input.callerRecognitionEvidenceSatisfied,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  expenditureMinor: 1000,
  callerCapitalizationThresholdMinor: 500,
  expectedBenefitMonths: 24,
  callerMinimumBenefitMonths: 12,
  callerRecognitionEvidenceSatisfied: true,
} satisfies Input;
export const exampleOutput = {
  meetsCallerAmountThreshold: true,
  meetsCallerBenefitHorizon: true,
  capitalizationCandidateUnderCallerPolicy: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/capex-opex-capitalization-threshold-checker",
  title: "Capex Opex Capitalization Threshold Policy Checker",
  description:
    "Screen actual expenditure against explicit caller amount/benefit-horizon policy and independently supplied recognition evidence; not a standards-specific asset recognition ruling or tax deduction advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "meetsCallerAmountThreshold",
      label: "Meets caller amount threshold",
      kind: "boolean",
    },
    {
      id: "meetsCallerBenefitHorizon",
      label: "Meets caller benefit horizon",
      kind: "boolean",
    },
    {
      id: "capitalizationCandidateUnderCallerPolicy",
      label: "Capitalization candidate under caller policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      expenditureMinor: value.expenditureMinor as number,
      callerCapitalizationThresholdMinor:
        value.callerCapitalizationThresholdMinor as number,
      expectedBenefitMonths: value.expectedBenefitMonths as number,
      callerMinimumBenefitMonths: value.callerMinimumBenefitMonths as number,
      callerRecognitionEvidenceSatisfied:
        value.callerRecognitionEvidenceSatisfied as boolean,
    }),
});
export const run = tool.execute;
export default tool;

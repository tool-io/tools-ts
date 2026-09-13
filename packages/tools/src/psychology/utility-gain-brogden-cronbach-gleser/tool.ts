import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSelectedPeople: number;
  readonly actualEmploymentYears: number;
  readonly callerPerformanceSdInCurrency: number;
  readonly actualValidityCorrelation: number;
  readonly actualSelectedStandardizedPredictorMean: number;
  readonly actualTotalSelectionCost: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSelectedPeople",
    label: "Actual selected people",
    kind: "number",
  },
  {
    id: "actualEmploymentYears",
    label: "Actual employment years",
    kind: "number",
  },
  {
    id: "callerPerformanceSdInCurrency",
    label: "Caller performance sd in currency",
    kind: "number",
  },
  {
    id: "actualValidityCorrelation",
    label: "Actual validity correlation",
    kind: "number",
  },
  {
    id: "actualSelectedStandardizedPredictorMean",
    label: "Actual selected standardized predictor mean",
    kind: "number",
  },
  {
    id: "actualTotalSelectionCost",
    label: "Actual total selection cost",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualSelectedPeople, "actualSelectedPeople", 0, 1000000);
  nonnegative(input.actualEmploymentYears, "actualEmploymentYears");
  nonnegative(
    input.callerPerformanceSdInCurrency,
    "callerPerformanceSdInCurrency",
  );
  nonnegative(input.actualTotalSelectionCost, "actualTotalSelectionCost");
  return {
    value:
      input.actualSelectedPeople *
        input.actualEmploymentYears *
        input.callerPerformanceSdInCurrency *
        input.actualValidityCorrelation *
        input.actualSelectedStandardizedPredictorMean -
      input.actualTotalSelectionCost,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSelectedPeople: 2,
    actualEmploymentYears: 2,
    callerPerformanceSdInCurrency: 10,
    actualValidityCorrelation: 0.5,
    actualSelectedStandardizedPredictorMean: 4,
    actualTotalSelectionCost: 10,
  },
  output: { result: { value: 70 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/utility-gain-brogden-cronbach-gleser",
  title: "Brogden-Cronbach-Gleser Utility Gain Calculator",
  description:
    "Restricted BCGutilityNTSDyrZ\u2212total cost, all independent actual economy/selection model parameters, one currency. Signed utility retained, not causal productivity gain or ethical selection approval. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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

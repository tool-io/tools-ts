import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly callerIndependentTargetHarvestTonnes: number;
  readonly actualEligibleVineCount: number;
  readonly callerIndependentExpectedMeanClusterKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentTargetHarvestTonnes",
    label: "Caller independent target harvest tonnes",
    kind: "number",
  },
  {
    id: "actualEligibleVineCount",
    label: "Actual eligible vine count",
    kind: "number",
  },
  {
    id: "callerIndependentExpectedMeanClusterKg",
    label: "Caller independent expected mean cluster kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentTargetHarvestTonnes,
    "callerIndependentTargetHarvestTonnes",
  );
  bounded(input.actualEligibleVineCount, "actualEligibleVineCount", 1, 1000000);
  positive(
    input.callerIndependentExpectedMeanClusterKg,
    "callerIndependentExpectedMeanClusterKg",
  );
  return {
    value:
      (1000 * input.callerIndependentTargetHarvestTonnes) /
      (input.actualEligibleVineCount *
        input.callerIndependentExpectedMeanClusterKg),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    callerIndependentTargetHarvestTonnes: 2,
    actualEligibleVineCount: 100,
    callerIndependentExpectedMeanClusterKg: 1,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/clusters-per-vine-for-target-tonnage",
  title: "Clusters Per Vine For Target Tonnage Calculator",
  description:
    "Conditionaltargettonnes\u00d71000/(vinecount\u00d7independentlycalibratedkgcluster),not establishes safe/optimumcrop load or actual futureyield.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualTotalRenalRemovalMassPerTime: number;
  readonly independentlyAssessedFilteredRemovalMassPerTime: number;
  readonly independentlyAssessedReabsorbedMassPerTime: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTotalRenalRemovalMassPerTime",
    label: "Actual total renal removal mass per time",
    kind: "number",
  },
  {
    id: "independentlyAssessedFilteredRemovalMassPerTime",
    label: "Independently assessed filtered removal mass per time",
    kind: "number",
  },
  {
    id: "independentlyAssessedReabsorbedMassPerTime",
    label: "Independently assessed reabsorbed mass per time",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.actualTotalRenalRemovalMassPerTime,
    input.independentlyAssessedFilteredRemovalMassPerTime,
    input.independentlyAssessedReabsorbedMassPerTime,
  ].forEach((v) => nonnegative(v, "actual-rate"));
  return {
    conditionalNetSecretedMassPerTime:
      input.actualTotalRenalRemovalMassPerTime -
      input.independentlyAssessedFilteredRemovalMassPerTime +
      input.independentlyAssessedReabsorbedMassPerTime,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTotalRenalRemovalMassPerTime: 10,
    independentlyAssessedFilteredRemovalMassPerTime: 4,
    independentlyAssessedReabsorbedMassPerTime: 2,
  },
  output: { result: { conditionalNetSecretedMassPerTime: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/tubular-secretion",
  title: "Tubular Secretion Calculator",
  description:
    "Declared renal mass balance excretion=filtration+secretion\u2212reabsorption; secretion residual from independently resolved compatible rates. Negative discrepancy retained, not infer tubular transport from plasma alone or clinical renal function.",
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

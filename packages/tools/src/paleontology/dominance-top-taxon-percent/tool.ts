import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  bounded,
  sum,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualObservedTaxonCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedTaxonCounts",
    label: "Actual observed taxon counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!input.actualObservedTaxonCounts.length)
    simpleError("actualObservedTaxonCounts", "Actualnonemptyobservations.");
  input.actualObservedTaxonCounts.forEach((v) =>
    nonnegative(v, "actualObservedTaxonCounts"),
  );
  input.actualObservedTaxonCounts.forEach((v) => bounded(v, "count", 0, 10000));
  return {
    value:
      (100 * Math.max(...input.actualObservedTaxonCounts)) /
      positive(sum(input.actualObservedTaxonCounts), "total"),
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
  input: { actualObservedTaxonCounts: [3, 1] },
  output: { result: { value: 75 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/dominance-top-taxon-percent",
  title: "Dominance Percent Top Taxon Calculator",
  description:
    "Actualmax-taxoncountdominancepercentagepositive-totalinventory,tiesnotresolvedasnewtaxon. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  positive,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyIdentifiedLayerCountsBySection: readonly number[];
  readonly callerVerifiedYearsPerAnnualLayer: number;
  readonly callerVerifiedHiatusYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyIdentifiedLayerCountsBySection",
    label: "Independently identified layer counts by section",
    kind: "numberList",
  },
  {
    id: "callerVerifiedYearsPerAnnualLayer",
    label: "Caller verified years per annual layer",
    kind: "number",
  },
  {
    id: "callerVerifiedHiatusYears",
    label: "Caller verified hiatus years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.independentlyIdentifiedLayerCountsBySection.length)
    simpleError("layers", "Actual sections.");
  input.independentlyIdentifiedLayerCountsBySection.forEach((v) =>
    bounded(v, "count", 0, 1000000),
  );
  positive(input.callerVerifiedYearsPerAnnualLayer, "periodicity");
  nonnegative(input.callerVerifiedHiatusYears, "hiatus");
  return {
    observedIdentifiedLayerCount: sum(
      input.independentlyIdentifiedLayerCountsBySection,
    ),
    conditionalLayerChronologyYears:
      sum(input.independentlyIdentifiedLayerCountsBySection) *
        input.callerVerifiedYearsPerAnnualLayer +
      input.callerVerifiedHiatusYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyIdentifiedLayerCountsBySection: [2, 3],
    callerVerifiedYearsPerAnnualLayer: 1,
    callerVerifiedHiatusYears: 4,
  },
  output: {
    result: {
      observedIdentifiedLayerCount: 5,
      conditionalLayerChronologyYears: 9,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/speleothem-layer-count",
  title: "Speleothem Layer Count Chronology Counter",
  description:
    "Actual disjoint layer counts\u00d7independently demonstrated layer periodicity+independently resolved hiatus years. Not assume all layers annual or derive absolute age without anchors.",
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

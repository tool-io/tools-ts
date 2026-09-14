import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  unique,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualElementTypeLabels: readonly string[];
  readonly actualLeftElementCounts: readonly number[];
  readonly actualRightElementCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualElementTypeLabels",
    label: "Actual element type labels",
    kind: "stringList",
  },
  {
    id: "actualLeftElementCounts",
    label: "Actual left element counts",
    kind: "numberList",
  },
  {
    id: "actualRightElementCounts",
    label: "Actual right element counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  unique(input.actualElementTypeLabels, "elements");
  aligned(input.actualElementTypeLabels, input.actualLeftElementCounts, "left");
  aligned(
    input.actualElementTypeLabels,
    input.actualRightElementCounts,
    "right",
  );
  input.actualLeftElementCounts
    .concat(input.actualRightElementCounts)
    .forEach((v) => bounded(v, "elementcount", 0, 10000));
  const a = input.actualLeftElementCounts.map((v, i) =>
    Math.max(v, input.actualRightElementCounts[i]),
  );
  return {
    elementLowerBounds: a,
    minimumIndividualsLowerBound: Math.max(...a),
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
    actualElementTypeLabels: ["femur", "humerus"],
    actualLeftElementCounts: [2, 1],
    actualRightElementCounts: [3, 1],
  },
  output: {
    result: { elementLowerBounds: [3, 1], minimumIndividualsLowerBound: 3 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/mni-common-element",
  title: "MNI from Most Common Element Calculator",
  description:
    "Actualtaxon/context/lateralityresolvedpaired-elementMNI lowerboundmaxoverelements(max(left,right)),nonadditive,not mixage/taxa or infer exactpopulation. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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

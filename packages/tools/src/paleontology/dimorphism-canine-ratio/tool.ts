import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  mean,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyClassifiedGroupACanineSizes: readonly number[];
  readonly actualIndependentlyClassifiedGroupBCanineSizes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyClassifiedGroupACanineSizes",
    label: "Actual independently classified group a canine sizes",
    kind: "numberList",
  },
  {
    id: "actualIndependentlyClassifiedGroupBCanineSizes",
    label: "Actual independently classified group b canine sizes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentlyClassifiedGroupACanineSizes.length)
    simpleError(
      "actualIndependentlyClassifiedGroupACanineSizes",
      "Actualnonemptyobservations.",
    );
  input.actualIndependentlyClassifiedGroupACanineSizes.forEach((v) =>
    positive(v, "actualIndependentlyClassifiedGroupACanineSizes"),
  );
  if (!input.actualIndependentlyClassifiedGroupBCanineSizes.length)
    simpleError(
      "actualIndependentlyClassifiedGroupBCanineSizes",
      "Actualnonemptyobservations.",
    );
  input.actualIndependentlyClassifiedGroupBCanineSizes.forEach((v) =>
    positive(v, "actualIndependentlyClassifiedGroupBCanineSizes"),
  );
  return {
    value:
      mean(input.actualIndependentlyClassifiedGroupACanineSizes) /
      mean(input.actualIndependentlyClassifiedGroupBCanineSizes),
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
    actualIndependentlyClassifiedGroupACanineSizes: [3, 5],
    actualIndependentlyClassifiedGroupBCanineSizes: [1, 3],
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/dimorphism-canine-ratio",
  title: "Sexual Dimorphism Canine Ratio Calculator",
  description:
    "Observedindependently establishedgroupmeancaninesizeratio,groupsexneverinferred,no automaticsexualdimorphism significance. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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

import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyIdentifiedFocalTaxonSpecimens: number;
  readonly actualTaxonomicallyResolvedTotalSpecimens: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyIdentifiedFocalTaxonSpecimens",
    label: "Actual independently identified focal taxon specimens",
    kind: "number",
  },
  {
    id: "actualTaxonomicallyResolvedTotalSpecimens",
    label: "Actual taxonomically resolved total specimens",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualIndependentlyIdentifiedFocalTaxonSpecimens,
    "actualIndependentlyIdentifiedFocalTaxonSpecimens",
    0,
    1000000,
  );
  bounded(
    input.actualTaxonomicallyResolvedTotalSpecimens,
    "actualTaxonomicallyResolvedTotalSpecimens",
    1,
    1000000,
  );
  if (
    input.actualIndependentlyIdentifiedFocalTaxonSpecimens >
    input.actualTaxonomicallyResolvedTotalSpecimens
  )
    simpleError("subset", "Focal≤resolvedtotal.");
  return {
    value:
      (100 * input.actualIndependentlyIdentifiedFocalTaxonSpecimens) /
      input.actualTaxonomicallyResolvedTotalSpecimens,
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
    actualIndependentlyIdentifiedFocalTaxonSpecimens: 3,
    actualTaxonomicallyResolvedTotalSpecimens: 4,
  },
  output: { result: { value: 75 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/bonebed-monospecificity",
  title: "Dinosaur Bonebed Monospecificity Percent Checker",
  description:
    "Actualbonebedfocalspecies/taxonomicallyresolvedcountpercentage,not countunknownsasfocalspeciesor automaticallyclassify entirebedmonospecific. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualExternallyEstablishedAnimalDosePerMass: number;
  readonly callerIndependentlyValidatedDosimetricAdjustmentFactor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualExternallyEstablishedAnimalDosePerMass",
    label: "Actual externally established animal dose per mass",
    kind: "number",
  },
  {
    id: "callerIndependentlyValidatedDosimetricAdjustmentFactor",
    label: "Caller independently validated dosimetric adjustment factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualExternallyEstablishedAnimalDosePerMass,
    "actual-animal-metric",
  );
  positive(
    input.callerIndependentlyValidatedDosimetricAdjustmentFactor,
    "validated-adjustment",
  );
  return {
    conditionalAdjustedHumanMetric:
      input.actualExternallyEstablishedAnimalDosePerMass *
      input.callerIndependentlyValidatedDosimetricAdjustmentFactor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualExternallyEstablishedAnimalDosePerMass: 2,
    callerIndependentlyValidatedDosimetricAdjustmentFactor: 3,
  },
  output: { result: { conditionalAdjustedHumanMetric: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/human-equivalent-dose",
  title: "Human Equivalent Dose Calculator",
  description:
    "Conditional HEDmetric adjustment, not the existing body-mass allometric model or clinical dose recommendation. Exact externally validated factor/route/endpoint/population and units required; not an authoritative human limit.",
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

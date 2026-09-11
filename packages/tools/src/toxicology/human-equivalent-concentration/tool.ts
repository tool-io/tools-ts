import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualExternallyEstablishedAnimalConcentration: number;
  readonly callerIndependentlyValidatedDosimetricAdjustmentFactor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualExternallyEstablishedAnimalConcentration",
    label: "Actual externally established animal concentration",
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
    input.actualExternallyEstablishedAnimalConcentration,
    "actual-animal-metric",
  );
  positive(
    input.callerIndependentlyValidatedDosimetricAdjustmentFactor,
    "validated-adjustment",
  );
  return {
    conditionalAdjustedHumanMetric:
      input.actualExternallyEstablishedAnimalConcentration *
      input.callerIndependentlyValidatedDosimetricAdjustmentFactor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualExternallyEstablishedAnimalConcentration: 2,
    callerIndependentlyValidatedDosimetricAdjustmentFactor: 3,
  },
  output: { result: { conditionalAdjustedHumanMetric: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/human-equivalent-concentration",
  title: "Human Equivalent Concentration Calculator",
  description:
    "Conditional HECdose-metric adjustment, not inference of gas/particle respiratory dosimetry. Exact externally validated factor/route/endpoint/population and units required; not an authoritative human limit.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualSectionShearForceNewtons: number;
  readonly callerIndependentInterfaceFirstMomentCubicMeters: number;
  readonly callerIndependentCompositeSecondMomentMetersFourth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSectionShearForceNewtons",
    label: "Actual section shear force newtons",
    kind: "number",
  },
  {
    id: "callerIndependentInterfaceFirstMomentCubicMeters",
    label: "Caller independent interface first moment cubic meters",
    kind: "number",
  },
  {
    id: "callerIndependentCompositeSecondMomentMetersFourth",
    label: "Caller independent composite second moment meters fourth",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerIndependentCompositeSecondMomentMetersFourth, "I");
  return {
    conditionalIdealInterfaceShearFlowNewtonsPerMeter:
      (input.actualSectionShearForceNewtons *
        input.callerIndependentInterfaceFirstMomentCubicMeters) /
      input.callerIndependentCompositeSecondMomentMetersFourth,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSectionShearForceNewtons: 2,
    callerIndependentInterfaceFirstMomentCubicMeters: 3,
    callerIndependentCompositeSecondMomentMetersFourth: 4,
  },
  output: {
    result: { conditionalIdealInterfaceShearFlowNewtonsPerMeter: 1.5 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/composite-shear-flow",
  title: "Composite Shear Flow Calculator",
  description:
    "Ideal elastic transformed-composite interface shearflowVQ/I, actual signed shear, independently computed QandIfor the SAMEtransformed section/interface. Not connector capacity, homogeneous shear stressVQ/Itor partial-interaction design.",
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

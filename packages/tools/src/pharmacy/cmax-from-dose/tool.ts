import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyEstablishedAvailableSystemicMass: number;
  readonly callerVerifiedInstantaneousDistributionVolume: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyEstablishedAvailableSystemicMass",
    label: "Actual independently established available systemic mass",
    kind: "number",
  },
  {
    id: "callerVerifiedInstantaneousDistributionVolume",
    label: "Caller verified instantaneous distribution volume",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyEstablishedAvailableSystemicMass,
    "actualIndependentlyEstablishedAvailableSystemicMass",
  );
  positive(
    input.callerVerifiedInstantaneousDistributionVolume,
    "callerVerifiedInstantaneousDistributionVolume",
  );
  return {
    value:
      input.actualIndependentlyEstablishedAvailableSystemicMass /
      input.callerVerifiedInstantaneousDistributionVolume,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyEstablishedAvailableSystemicMass: 10,
    callerVerifiedInstantaneousDistributionVolume: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/cmax-from-dose",
  title: "Cmax From Dose Calculator",
  description:
    "Conditional instantaneous well mixed bolus INITIAL concentration mass/Vd, not actualoralCmaxfrom dose alone or peak forecast in multi compartment kinetics. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

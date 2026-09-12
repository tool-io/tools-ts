import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualDispensedUnits: number;
  readonly actualCarriedInUnits: number;
  readonly actualReturnedRemainingUnits: number;
  readonly actualKnownNonAdherenceLossUnits: number;
  readonly callerClinicianExpectedConsumedUnits: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDispensedUnits",
    label: "Actual dispensed units",
    kind: "number",
  },
  {
    id: "actualCarriedInUnits",
    label: "Actual carried in units",
    kind: "number",
  },
  {
    id: "actualReturnedRemainingUnits",
    label: "Actual returned remaining units",
    kind: "number",
  },
  {
    id: "actualKnownNonAdherenceLossUnits",
    label: "Actual known non adherence loss units",
    kind: "number",
  },
  {
    id: "callerClinicianExpectedConsumedUnits",
    label: "Caller clinician expected consumed units",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualDispensedUnits, "actualDispensedUnits");
  nonnegative(input.actualCarriedInUnits, "actualCarriedInUnits");
  nonnegative(
    input.actualReturnedRemainingUnits,
    "actualReturnedRemainingUnits",
  );
  nonnegative(
    input.actualKnownNonAdherenceLossUnits,
    "actualKnownNonAdherenceLossUnits",
  );
  positive(
    input.callerClinicianExpectedConsumedUnits,
    "callerClinicianExpectedConsumedUnits",
  );
  return {
    value:
      (100 *
        (input.actualDispensedUnits +
          input.actualCarriedInUnits -
          input.actualReturnedRemainingUnits -
          input.actualKnownNonAdherenceLossUnits)) /
      input.callerClinicianExpectedConsumedUnits,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDispensedUnits: 10,
    actualCarriedInUnits: 2,
    actualReturnedRemainingUnits: 3,
    actualKnownNonAdherenceLossUnits: 1,
    callerClinicianExpectedConsumedUnits: 10,
  },
  output: { result: { value: 80 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/pill-count-adherence-percentage",
  title: "Pill Count Adherence Percentage Calculator",
  description:
    "Pill count apparent use percentage of actual independently expected consumption, known lost/discarded units separate; can exceed100or negative for inconsistent ledger. Possession count not proof of ingestion or safe adherence. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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

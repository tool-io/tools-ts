import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualDispensedQuantityUnits: number;
  readonly callerClinicianOrderedUnitsPerDay: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDispensedQuantityUnits",
    label: "Actual dispensed quantity units",
    kind: "number",
  },
  {
    id: "callerClinicianOrderedUnitsPerDay",
    label: "Caller clinician ordered units per day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualDispensedQuantityUnits,
    "actualDispensedQuantityUnits",
  );
  positive(
    input.callerClinicianOrderedUnitsPerDay,
    "callerClinicianOrderedUnitsPerDay",
  );
  return {
    value:
      (1 * input.actualDispensedQuantityUnits) /
      input.callerClinicianOrderedUnitsPerDay,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDispensedQuantityUnits: 2,
    callerClinicianOrderedUnitsPerDay: 4,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/days-supply-from-quantity-directions",
  title: "Days Supply From Quantity Directions Calculator",
  description:
    "Actual supplied quantity/independently prescribed day directions, not choose dose; actual compatible definitions and matching units required, no causal efficacy/diagnosis or safety claim.",
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

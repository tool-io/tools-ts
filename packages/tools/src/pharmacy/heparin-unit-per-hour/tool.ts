import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualRecordedHeparinMlPerHour: number;
  readonly callerVerifiedHeparinUnitsPerMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRecordedHeparinMlPerHour",
    label: "Actual recorded heparin ml per hour",
    kind: "number",
  },
  {
    id: "callerVerifiedHeparinUnitsPerMl",
    label: "Caller verified heparin units per ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualRecordedHeparinMlPerHour,
    "actualRecordedHeparinMlPerHour",
  );
  positive(
    input.callerVerifiedHeparinUnitsPerMl,
    "callerVerifiedHeparinUnitsPerMl",
  );
  return {
    value:
      input.actualRecordedHeparinMlPerHour *
      input.callerVerifiedHeparinUnitsPerMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRecordedHeparinMlPerHour: 2,
    callerVerifiedHeparinUnitsPerMl: 10,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/heparin-unit-per-hour",
  title: "Heparin Units Per Hour Calculator",
  description:
    "Actual heparin product/pump units/hour ledger, massmgnot substituted for biological units. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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

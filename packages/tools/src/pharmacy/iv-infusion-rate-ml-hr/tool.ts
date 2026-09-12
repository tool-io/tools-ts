import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualOrderedVolumeMl: number;
  readonly callerClinicianOrderedDurationHours: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOrderedVolumeMl",
    label: "Actual ordered volume ml",
    kind: "number",
  },
  {
    id: "callerClinicianOrderedDurationHours",
    label: "Caller clinician ordered duration hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualOrderedVolumeMl, "actualOrderedVolumeMl");
  positive(
    input.callerClinicianOrderedDurationHours,
    "callerClinicianOrderedDurationHours",
  );
  return {
    value:
      input.actualOrderedVolumeMl / input.callerClinicianOrderedDurationHours,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualOrderedVolumeMl: 100, callerClinicianOrderedDurationHours: 2 },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/iv-infusion-rate-ml-hr",
  title: "IV Infusion Rate mL/hr Calculator",
  description:
    "Recorded actual infusions mL/hour volume/time, no volume or duration prescribed. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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

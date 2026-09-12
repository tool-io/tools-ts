import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerClinicianPrescribedNorepinephrineMcgPerMinute: number;
  readonly callerVerifiedNorepinephrineMcgPerMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerClinicianPrescribedNorepinephrineMcgPerMinute",
    label: "Caller clinician prescribed norepinephrine mcg per minute",
    kind: "number",
  },
  {
    id: "callerVerifiedNorepinephrineMcgPerMl",
    label: "Caller verified norepinephrine mcg per ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerClinicianPrescribedNorepinephrineMcgPerMinute,
    "callerClinicianPrescribedNorepinephrineMcgPerMinute",
  );
  positive(
    input.callerVerifiedNorepinephrineMcgPerMl,
    "callerVerifiedNorepinephrineMcgPerMl",
  );
  return {
    value:
      (input.callerClinicianPrescribedNorepinephrineMcgPerMinute * 60) /
      input.callerVerifiedNorepinephrineMcgPerMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerClinicianPrescribedNorepinephrineMcgPerMinute: 2,
    callerVerifiedNorepinephrineMcgPerMl: 60,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/norepinephrine-infusion-rate",
  title: "Norepinephrine Infusion Rate Calculator",
  description:
    "Non-weight normalized norepinephrine clinician actual mcg/min order\u2192mL/hour using verified product mcg/mL, no route/infusion instructions. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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

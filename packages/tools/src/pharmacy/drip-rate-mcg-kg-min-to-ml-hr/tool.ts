import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerClinicianOrderedMcgPerKgMinute: number;
  readonly actualVerifiedBodyMassKg: number;
  readonly callerVerifiedProductConcentrationMcgPerMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerClinicianOrderedMcgPerKgMinute",
    label: "Caller clinician ordered mcg per kg minute",
    kind: "number",
  },
  {
    id: "actualVerifiedBodyMassKg",
    label: "Actual verified body mass kg",
    kind: "number",
  },
  {
    id: "callerVerifiedProductConcentrationMcgPerMl",
    label: "Caller verified product concentration mcg per ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerClinicianOrderedMcgPerKgMinute,
    "callerClinicianOrderedMcgPerKgMinute",
  );
  positive(input.actualVerifiedBodyMassKg, "actualVerifiedBodyMassKg");
  positive(
    input.callerVerifiedProductConcentrationMcgPerMl,
    "callerVerifiedProductConcentrationMcgPerMl",
  );
  return {
    value:
      (60 *
        input.callerClinicianOrderedMcgPerKgMinute *
        input.actualVerifiedBodyMassKg) /
      input.callerVerifiedProductConcentrationMcgPerMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerClinicianOrderedMcgPerKgMinute: 2,
    actualVerifiedBodyMassKg: 3,
    callerVerifiedProductConcentrationMcgPerMl: 6,
  },
  output: { result: { value: 60 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/drip-rate-mcg-kg-min-to-ml-hr",
  title: "mcg/kg/min to mL/hr Converter",
  description:
    "Unit conversion actual independent mcg/kg/min order\u00d7kg\u00d760/product mcg/mL\u2192mL/hour; no recipe/concentrations elected. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualOrderedInfusionVolumeMl: number;
  readonly callerProductDropFactorGttPerMl: number;
  readonly callerClinicianOrderedDurationMinutes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOrderedInfusionVolumeMl",
    label: "Actual ordered infusion volume ml",
    kind: "number",
  },
  {
    id: "callerProductDropFactorGttPerMl",
    label: "Caller product drop factor gtt per ml",
    kind: "number",
  },
  {
    id: "callerClinicianOrderedDurationMinutes",
    label: "Caller clinician ordered duration minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualOrderedInfusionVolumeMl,
    "actualOrderedInfusionVolumeMl",
  );
  positive(
    input.callerProductDropFactorGttPerMl,
    "callerProductDropFactorGttPerMl",
  );
  positive(
    input.callerClinicianOrderedDurationMinutes,
    "callerClinicianOrderedDurationMinutes",
  );
  return {
    value:
      (input.actualOrderedInfusionVolumeMl *
        input.callerProductDropFactorGttPerMl) /
      input.callerClinicianOrderedDurationMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualOrderedInfusionVolumeMl: 100,
    callerProductDropFactorGttPerMl: 10,
    callerClinicianOrderedDurationMinutes: 100,
  },
  output: { result: { value: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/iv-drop-rate-gtt-min",
  title: "IV Drop Rate gtt/min Calculator",
  description:
    "Recorded prescription infusion gtt/min volume\u00d7verified set drop factor/time, unroundedactual drip rate bookkeeping. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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

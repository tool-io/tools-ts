import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  fraction,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerClinicianSpecifiedSteadyStateFraction: number;
  readonly callerFittedEliminationRatePerHour: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerClinicianSpecifiedSteadyStateFraction",
    label: "Caller clinician specified steady state fraction",
    kind: "number",
  },
  {
    id: "callerFittedEliminationRatePerHour",
    label: "Caller fitted elimination rate per hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(
    input.callerClinicianSpecifiedSteadyStateFraction,
    "callerClinicianSpecifiedSteadyStateFraction",
  );
  positive(
    input.callerFittedEliminationRatePerHour,
    "callerFittedEliminationRatePerHour",
  );
  if (
    input.callerClinicianSpecifiedSteadyStateFraction <= 0 ||
    input.callerClinicianSpecifiedSteadyStateFraction >= 1
  )
    simpleError("fraction", "Specifiedinteriorsteadyfraction.");
  return {
    value:
      -Math.log1p(-input.callerClinicianSpecifiedSteadyStateFraction) /
      input.callerFittedEliminationRatePerHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerClinicianSpecifiedSteadyStateFraction: 0.75,
    callerFittedEliminationRatePerHour: 1,
  },
  output: { result: { value: 1.3862943611198906 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/time-to-steady-state",
  title: "Time to Steady State Calculator",
  description:
    "First order approach to specified steady fraction\u2212ln(1\u2212f)/ke,0<f<1, no exactf=1finite time or automatic five half live rule. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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

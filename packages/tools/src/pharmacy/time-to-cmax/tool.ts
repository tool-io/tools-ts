import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerFittedAbsorptionRatePerHour: number;
  readonly callerFittedEliminationRatePerHour: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerFittedAbsorptionRatePerHour",
    label: "Caller fitted absorption rate per hour",
    kind: "number",
  },
  {
    id: "callerFittedEliminationRatePerHour",
    label: "Caller fitted elimination rate per hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerFittedAbsorptionRatePerHour,
    "callerFittedAbsorptionRatePerHour",
  );
  positive(
    input.callerFittedEliminationRatePerHour,
    "callerFittedEliminationRatePerHour",
  );
  if (
    input.callerFittedAbsorptionRatePerHour ===
    input.callerFittedEliminationRatePerHour
  )
    simpleError("rates", "Distinctka/keratesrequiredbydeclaredformula.");
  return {
    value:
      Math.log(
        input.callerFittedAbsorptionRatePerHour /
          input.callerFittedEliminationRatePerHour,
      ) /
      (input.callerFittedAbsorptionRatePerHour -
        input.callerFittedEliminationRatePerHour),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerFittedAbsorptionRatePerHour: 2,
    callerFittedEliminationRatePerHour: 1,
  },
  output: { result: { value: 0.6931471805599453 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/time-to-cmax",
  title: "Tmax Calculator",
  description:
    "Restricted first order oral onecompartmentBateman tmax=ln(ka/ke)/(ka\u2212ke), different positive matched rates. Lag/repeated dosing/multiple compartments excluded. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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

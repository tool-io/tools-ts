import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly callerClinicianIndependentlySpecifiedFluidBudgetMl: number;
  readonly actualAlreadyCountedFluidIntakeMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerClinicianIndependentlySpecifiedFluidBudgetMl",
    label: "Caller clinician independently specified fluid budget ml",
    kind: "number",
  },
  {
    id: "actualAlreadyCountedFluidIntakeMl",
    label: "Actual already counted fluid intake ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerClinicianIndependentlySpecifiedFluidBudgetMl,
    "callerClinicianIndependentlySpecifiedFluidBudgetMl",
  );
  nonnegative(
    input.actualAlreadyCountedFluidIntakeMl,
    "actualAlreadyCountedFluidIntakeMl",
  );
  return {
    value:
      input.callerClinicianIndependentlySpecifiedFluidBudgetMl -
      input.actualAlreadyCountedFluidIntakeMl,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    callerClinicianIndependentlySpecifiedFluidBudgetMl: 500,
    actualAlreadyCountedFluidIntakeMl: 400,
  },
  output: { result: { value: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "health/daily-water-intake",
  title: "Daily Water Intake Calculator",
  description:
    "Signedremainingactualclinician-establishedfluidbudgetminusobservedintake,no selects dailyhydrationtarget,fluidrestrictionor medicalpermission.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

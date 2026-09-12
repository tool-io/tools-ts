import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualRecordedPumpMlPerHour: number;
  readonly callerVerifiedDopamineProductMcgPerMl: number;
  readonly actualVerifiedBodyMassKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRecordedPumpMlPerHour",
    label: "Actual recorded pump ml per hour",
    kind: "number",
  },
  {
    id: "callerVerifiedDopamineProductMcgPerMl",
    label: "Caller verified dopamine product mcg per ml",
    kind: "number",
  },
  {
    id: "actualVerifiedBodyMassKg",
    label: "Actual verified body mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualRecordedPumpMlPerHour, "actualRecordedPumpMlPerHour");
  positive(
    input.callerVerifiedDopamineProductMcgPerMl,
    "callerVerifiedDopamineProductMcgPerMl",
  );
  positive(input.actualVerifiedBodyMassKg, "actualVerifiedBodyMassKg");
  return {
    value:
      (input.actualRecordedPumpMlPerHour *
        input.callerVerifiedDopamineProductMcgPerMl) /
      (60 * input.actualVerifiedBodyMassKg),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRecordedPumpMlPerHour: 60,
    callerVerifiedDopamineProductMcgPerMl: 6,
    actualVerifiedBodyMassKg: 3,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/dopamine-drip-mcg-kg-min",
  title: "Dopamine Drip mcg/kg/min Calculator",
  description:
    "Actual dopamine pump/product ledger inverse mcg/kg/min from recordedmL/hour, verified mcg/mL/kg; not recommended dose. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly requiredCo2KgPerHour: number;
  readonly callerEmissionKgCo2PerKgFuel: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "requiredCo2KgPerHour",
    label: "Required co2 kg per hour",
    kind: "number",
  },
  {
    id: "callerEmissionKgCo2PerKgFuel",
    label: "Caller emission kg co2 per kg fuel",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.requiredCo2KgPerHour, "demand");
  positive(i.callerEmissionKgCo2PerKgFuel, "factor");
  return {
    fuelKgPerHour: i.requiredCo2KgPerHour / i.callerEmissionKgCo2PerKgFuel,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { requiredCo2KgPerHour: 4, callerEmissionKgCo2PerKgFuel: 2 },
  output: { result: { fuelKgPerHour: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/co2-generator-burn-rate",
  title: "CO2 Generator Burn Rate Calculator",
  description:
    "Fuel inventory for independently measured CO2 generator emission factor; not combustion/ventilation or indoor safety design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

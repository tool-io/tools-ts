import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedTankMassKg: number;
  readonly unusableReserveMassKg: number;
  readonly measuredOutletMassRatesKgHour: readonly number[];
  readonly callerMeasuredDutyFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly usableTankMassKg: number;
  readonly modeledTotalMassDrawKgHour: number;
  readonly estimatedTankRuntimeHours: number;
}>;
const inputFields = [
  { id: "observedTankMassKg", label: "Observed tank mass kg", kind: "number" },
  {
    id: "unusableReserveMassKg",
    label: "Unusable reserve mass kg",
    kind: "number",
  },
  {
    id: "measuredOutletMassRatesKgHour",
    label: "Measured outlet mass rates kg hour",
    kind: "numberList",
  },
  {
    id: "callerMeasuredDutyFractions",
    label: "Caller measured duty fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedTankMassKg, "observedTankMassKg");
  nonnegative(input.unusableReserveMassKg, "unusableReserveMassKg");
  input.measuredOutletMassRatesKgHour.forEach((v) =>
    nonnegative(v, "measuredOutletMassRatesKgHour"),
  );
  input.callerMeasuredDutyFractions.forEach((v) =>
    fraction(v, "callerMeasuredDutyFractions"),
  );
  aligned(
    input.measuredOutletMassRatesKgHour,
    input.callerMeasuredDutyFractions,
    "measuredOutletMassRatesKgHour",
  );
  const usable = input.observedTankMassKg - input.unusableReserveMassKg;
  if (usable < 0) simpleError("reserve", "Reserve exceeds observed inventory.");
  const rate = sum(
    input.measuredOutletMassRatesKgHour.map(
      (v, i) => v * input.callerMeasuredDutyFractions[i],
    ),
  );
  positive(rate, "draw");
  return {
    usableTankMassKg: usable,
    modeledTotalMassDrawKgHour: rate,
    estimatedTankRuntimeHours: usable / rate,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTankMassKg: 10,
  unusableReserveMassKg: 2,
  measuredOutletMassRatesKgHour: [1, 2],
  callerMeasuredDutyFractions: [0.5, 0.25],
} satisfies Input;
export const exampleOutput = {
  usableTankMassKg: 8,
  modeledTotalMassDrawKgHour: 1,
  estimatedTankRuntimeHours: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/co2-tank-runtime-hours",
  title: "CO2 Tank Runtime Hours Calculator",
  description:
    "Budget actual CO2 tank mass inventory minus caller unusable reserve against independently measured duty-weighted mass outlets; no pressure→mass inference, regulator settings, enrichment dose or exposure/combustion safety advice.",
  inputs: inputFields,
  outputs: [
    { id: "usableTankMassKg", label: "Usable tank mass kg", kind: "number" },
    {
      id: "modeledTotalMassDrawKgHour",
      label: "Modeled total mass draw kg hour",
      kind: "number",
    },
    {
      id: "estimatedTankRuntimeHours",
      label: "Estimated tank runtime hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTankMassKg: value.observedTankMassKg as number,
      unusableReserveMassKg: value.unusableReserveMassKg as number,
      measuredOutletMassRatesKgHour:
        value.measuredOutletMassRatesKgHour as readonly number[],
      callerMeasuredDutyFractions:
        value.callerMeasuredDutyFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

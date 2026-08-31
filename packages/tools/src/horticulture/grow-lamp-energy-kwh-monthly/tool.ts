import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
  shape,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedLampPowerWByBank: readonly number[];
  readonly observedBankOnHoursByDay: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly observedElectricalKwhByBank: readonly number[];
  readonly totalObservedLampElectricalKwh: number;
  readonly coveredObservationDays: number;
}>;
const inputFields = [
  {
    id: "observedLampPowerWByBank",
    label: "Observed lamp power w by bank",
    kind: "numberList",
  },
  {
    id: "observedBankOnHoursByDay",
    label: "Observed bank on hours by day",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLampPowerWByBank.forEach((v) =>
    nonnegative(v, "observedLampPowerWByBank"),
  );
  aligned(
    input.observedLampPowerWByBank,
    input.observedBankOnHoursByDay,
    "banks",
  );
  const days = shape(input.observedBankOnHoursByDay, "hours");
  input.observedBankOnHoursByDay.forEach((r) =>
    r.forEach((v) => {
      if (v < 0 || v > 24)
        simpleError("hours", "Actual daily on hours in [0,24] required.");
    }),
  );
  const energy = input.observedLampPowerWByBank.map(
    (v, i) => (v / 1000) * sum(input.observedBankOnHoursByDay[i]),
  );
  return {
    observedElectricalKwhByBank: energy,
    totalObservedLampElectricalKwh: sum(energy),
    coveredObservationDays: days,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLampPowerWByBank: [100, 200],
  observedBankOnHoursByDay: [
    [10, 12],
    [8, 10],
  ],
} satisfies Input;
export const exampleOutput = {
  observedElectricalKwhByBank: [2.2, 3.6],
  totalObservedLampElectricalKwh: 5.8,
  coveredObservationDays: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/grow-lamp-energy-kwh-monthly",
  title: "Grow Lamp Energy KWH Monthly Calculator",
  description:
    "Integrate actual lamp-bank daily duty log with matched electrical power, reporting covered days only; not assumed thirty-day month, cost-per-DLI conversion or inferred fixture efficiency.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedElectricalKwhByBank",
      label: "Observed electrical kwh by bank",
      kind: "numberList",
    },
    {
      id: "totalObservedLampElectricalKwh",
      label: "Total observed lamp electrical kwh",
      kind: "number",
    },
    {
      id: "coveredObservationDays",
      label: "Covered observation days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLampPowerWByBank:
        value.observedLampPowerWByBank as readonly number[],
      observedBankOnHoursByDay:
        value.observedBankOnHoursByDay as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;

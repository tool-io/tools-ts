import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerMatchedChillerLoadsKw: readonly number[];
  readonly observedElectricalPowersKw: readonly number[];
  readonly observedRunHours: readonly number[];
}>;
export type Output = Readonly<{
  readonly intervalChillerCoolingKwh: number;
  readonly intervalChillerElectricKwh: number;
  readonly energyWeightedPartLoadCop: number;
}>;
const inputFields = [
  {
    id: "callerMatchedChillerLoadsKw",
    label: "Caller matched chiller loads kw",
    kind: "numberList",
  },
  {
    id: "observedElectricalPowersKw",
    label: "Observed electrical powers kw",
    kind: "numberList",
  },
  { id: "observedRunHours", label: "Observed run hours", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedElectricalPowersKw.forEach((v) =>
    positive(v, "observedElectricalPowersKw"),
  );
  input.observedRunHours.forEach((v) => positive(v, "observedRunHours"));
  input.callerMatchedChillerLoadsKw.forEach((v) =>
    nonnegative(v, "callerMatchedChillerLoadsKw"),
  );
  aligned(
    input.callerMatchedChillerLoadsKw,
    input.observedElectricalPowersKw,
    "callerMatchedChillerLoadsKw",
  );
  aligned(
    input.callerMatchedChillerLoadsKw,
    input.observedRunHours,
    "callerMatchedChillerLoadsKw",
  );
  const cooling = sum(
      input.callerMatchedChillerLoadsKw.map(
        (v, i) => v * input.observedRunHours[i],
      ),
    ),
    power = sum(
      input.observedElectricalPowersKw.map(
        (v, i) => v * input.observedRunHours[i],
      ),
    );
  return {
    intervalChillerCoolingKwh: cooling,
    intervalChillerElectricKwh: power,
    energyWeightedPartLoadCop: cooling / power,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedChillerLoadsKw: [10, 20],
  observedElectricalPowersKw: [2, 5],
  observedRunHours: [1, 2],
} satisfies Input;
export const exampleOutput = {
  intervalChillerCoolingKwh: 50,
  intervalChillerElectricKwh: 12,
  energyWeightedPartLoadCop: 4.166666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/hvac-chiller-part-load",
  title: "Chiller Part-Load Calculator",
  description:
    "Actual part-load energy profile COP with unequal run exposures, not arithmetic meanCOP or instantaneous chillerCOP. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalChillerCoolingKwh",
      label: "Interval chiller cooling kwh",
      kind: "number",
    },
    {
      id: "intervalChillerElectricKwh",
      label: "Interval chiller electric kwh",
      kind: "number",
    },
    {
      id: "energyWeightedPartLoadCop",
      label: "Energy weighted part load cop",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedChillerLoadsKw:
        value.callerMatchedChillerLoadsKw as readonly number[],
      observedElectricalPowersKw:
        value.observedElectricalPowersKw as readonly number[],
      observedRunHours: value.observedRunHours as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

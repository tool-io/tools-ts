import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly turbineInletEnthalpyJKg: number;
  readonly turbineExitEnthalpyJKg: number;
  readonly pumpInletEnthalpyJKg: number;
  readonly pumpExitEnthalpyJKg: number;
}>;
export type Output = Readonly<{
  readonly rankineNetSpecificWorkJKg: number;
  readonly rankineHeatInputJKg: number;
  readonly rankineCycleEfficiency: number;
}>;
const inputFields = [
  {
    id: "turbineInletEnthalpyJKg",
    label: "Turbine inlet enthalpy j kg",
    kind: "number",
  },
  {
    id: "turbineExitEnthalpyJKg",
    label: "Turbine exit enthalpy j kg",
    kind: "number",
  },
  {
    id: "pumpInletEnthalpyJKg",
    label: "Pump inlet enthalpy j kg",
    kind: "number",
  },
  {
    id: "pumpExitEnthalpyJKg",
    label: "Pump exit enthalpy j kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const turbine = input.turbineInletEnthalpyJKg - input.turbineExitEnthalpyJKg,
    pump = input.pumpExitEnthalpyJKg - input.pumpInletEnthalpyJKg,
    heat = input.turbineInletEnthalpyJKg - input.pumpExitEnthalpyJKg;
  nonnegative(turbine, "turbine work");
  nonnegative(pump, "pump input");
  positive(heat, "boiler input");
  return {
    rankineNetSpecificWorkJKg: turbine - pump,
    rankineHeatInputJKg: heat,
    rankineCycleEfficiency: (turbine - pump) / heat,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  turbineInletEnthalpyJKg: 100,
  turbineExitEnthalpyJKg: 60,
  pumpInletEnthalpyJKg: 20,
  pumpExitEnthalpyJKg: 25,
} satisfies Input;
export const exampleOutput = {
  rankineNetSpecificWorkJKg: 35,
  rankineHeatInputJKg: 75,
  rankineCycleEfficiency: 0.4666666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/rankine-cycle-efficiency",
  title: "Rankine Cycle Efficiency Calculator",
  description:
    "Four independently established single-loop Rankine state enthalpies, no steam properties/EOS, regenerative/reheat or ideal efficiency implied. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "rankineNetSpecificWorkJKg",
      label: "Rankine net specific work j kg",
      kind: "number",
    },
    {
      id: "rankineHeatInputJKg",
      label: "Rankine heat input j kg",
      kind: "number",
    },
    {
      id: "rankineCycleEfficiency",
      label: "Rankine cycle efficiency",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      turbineInletEnthalpyJKg: value.turbineInletEnthalpyJKg as number,
      turbineExitEnthalpyJKg: value.turbineExitEnthalpyJKg as number,
      pumpInletEnthalpyJKg: value.pumpInletEnthalpyJKg as number,
      pumpExitEnthalpyJKg: value.pumpExitEnthalpyJKg as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerOutputFoodEnergyMj: readonly number[];
  readonly callerDirectInputEnergyMj: readonly number[];
  readonly callerEmbodiedInputEnergyMj: readonly number[];
}>;
export type Output = Readonly<{
  readonly boundaryOutputEnergyMj: number;
  readonly boundaryInputEnergyMj: number;
  readonly energyUseEfficiencyRatio: number;
}>;
const inputFields = [
  {
    id: "callerOutputFoodEnergyMj",
    label: "Caller output food energy mj",
    kind: "numberList",
  },
  {
    id: "callerDirectInputEnergyMj",
    label: "Caller direct input energy mj",
    kind: "numberList",
  },
  {
    id: "callerEmbodiedInputEnergyMj",
    label: "Caller embodied input energy mj",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerOutputFoodEnergyMj.forEach((v) =>
    nonnegative(v, "callerOutputFoodEnergyMj"),
  );
  input.callerDirectInputEnergyMj.forEach((v) =>
    nonnegative(v, "callerDirectInputEnergyMj"),
  );
  input.callerEmbodiedInputEnergyMj.forEach((v) =>
    nonnegative(v, "callerEmbodiedInputEnergyMj"),
  );
  const output = sum(input.callerOutputFoodEnergyMj),
    inlet =
      sum(input.callerDirectInputEnergyMj) +
      sum(input.callerEmbodiedInputEnergyMj);
  positive(inlet, "defined boundary energy input");
  return {
    boundaryOutputEnergyMj: output,
    boundaryInputEnergyMj: inlet,
    energyUseEfficiencyRatio: output / inlet,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerOutputFoodEnergyMj: [10, 20],
  callerDirectInputEnergyMj: [2, 3],
  callerEmbodiedInputEnergyMj: [1, 4],
} satisfies Input;
export const exampleOutput = {
  boundaryOutputEnergyMj: 30,
  boundaryInputEnergyMj: 10,
  energyUseEfficiencyRatio: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/energy-use-efficiency",
  title: "Agriculture Energy Use Efficiency Calculator",
  description:
    "Declared agriculture direct+embodied energy inventory ratio with explicit output food energy, not instantaneous mechanical efficiency or carbon accounting. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "boundaryOutputEnergyMj",
      label: "Boundary output energy mj",
      kind: "number",
    },
    {
      id: "boundaryInputEnergyMj",
      label: "Boundary input energy mj",
      kind: "number",
    },
    {
      id: "energyUseEfficiencyRatio",
      label: "Energy use efficiency ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerOutputFoodEnergyMj:
        value.callerOutputFoodEnergyMj as readonly number[],
      callerDirectInputEnergyMj:
        value.callerDirectInputEnergyMj as readonly number[],
      callerEmbodiedInputEnergyMj:
        value.callerEmbodiedInputEnergyMj as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

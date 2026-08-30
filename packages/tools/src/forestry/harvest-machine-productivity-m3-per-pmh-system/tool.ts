import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly deliveredVolumesM3: readonly number[];
  readonly productiveMinutes: readonly number[];
  readonly delayMinutes: readonly number[];
}>;
export type Output = Readonly<{
  readonly productivityM3PerProductiveMachineHour: number;
  readonly productivityM3PerScheduledMachineHour: number;
  readonly machineUtilizationFraction: number;
}>;
const inputFields = [
  {
    id: "deliveredVolumesM3",
    label: "Delivered volumes m3",
    kind: "numberList",
  },
  { id: "productiveMinutes", label: "Productive minutes", kind: "numberList" },
  { id: "delayMinutes", label: "Delay minutes", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.productiveMinutes.forEach((v) => positive(v, "productiveMinutes"));
  input.deliveredVolumesM3.forEach((v) => nonnegative(v, "deliveredVolumesM3"));
  input.delayMinutes.forEach((v) => nonnegative(v, "delayMinutes"));
  aligned(
    input.deliveredVolumesM3,
    input.productiveMinutes,
    "deliveredVolumesM3",
  );
  aligned(input.deliveredVolumesM3, input.delayMinutes, "deliveredVolumesM3");
  const volume = input.deliveredVolumesM3.reduce((a, b) => a + b, 0),
    pm = input.productiveMinutes.reduce((a, b) => a + b, 0),
    sm = pm + input.delayMinutes.reduce((a, b) => a + b, 0);
  return {
    productivityM3PerProductiveMachineHour: (60 * volume) / pm,
    productivityM3PerScheduledMachineHour: (60 * volume) / sm,
    machineUtilizationFraction: pm / sm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  deliveredVolumesM3: [10, 20],
  productiveMinutes: [30, 30],
  delayMinutes: [10, 20],
} satisfies Input;
export const exampleOutput = {
  productivityM3PerProductiveMachineHour: 30,
  productivityM3PerScheduledMachineHour: 20,
  machineUtilizationFraction: 0.6666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/harvest-machine-productivity-m3-per-pmh-system",
  title: "Harvest System Productivity m³/PMH",
  description:
    "Separate observed delivered-volume productivity per productive/scheduled machine hour and utilization; operational delays remain explicit and no machine capability guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "productivityM3PerProductiveMachineHour",
      label: "Productivity m3 per productive machine hour",
      kind: "number",
    },
    {
      id: "productivityM3PerScheduledMachineHour",
      label: "Productivity m3 per scheduled machine hour",
      kind: "number",
    },
    {
      id: "machineUtilizationFraction",
      label: "Machine utilization fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      deliveredVolumesM3: value.deliveredVolumesM3 as readonly number[],
      productiveMinutes: value.productiveMinutes as readonly number[],
      delayMinutes: value.delayMinutes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

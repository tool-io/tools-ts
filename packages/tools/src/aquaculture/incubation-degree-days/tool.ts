import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  thermalIntegral,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesDays: readonly number[];
  readonly temperaturesC: readonly number[];
  readonly baseTemperatureC: number;
  readonly targetDegreeDays: number;
}>;
export type Output = Readonly<{
  readonly accumulatedDegreeDays: number;
  readonly remainingDegreeDays: number;
  readonly targetMet: boolean;
}>;
const inputFields = [
  { id: "timesDays", label: "Times days", kind: "numberList" },
  { id: "temperaturesC", label: "Temperatures c", kind: "numberList" },
  { id: "baseTemperatureC", label: "Base temperature c", kind: "number" },
  { id: "targetDegreeDays", label: "Target degree days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.targetDegreeDays, "targetDegreeDays");
  const accumulatedDegreeDays = thermalIntegral(
    input.timesDays,
    input.temperaturesC,
    input.baseTemperatureC,
  );
  return {
    accumulatedDegreeDays,
    remainingDegreeDays: Math.max(
      0,
      input.targetDegreeDays - accumulatedDegreeDays,
    ),
    targetMet: accumulatedDegreeDays >= input.targetDegreeDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesDays: [0, 1, 2],
  temperaturesC: [0, 10, 0],
  baseTemperatureC: 5,
  targetDegreeDays: 3,
} satisfies Input;
export const exampleOutput = {
  accumulatedDegreeDays: 2.5,
  remainingDegreeDays: 0.5,
  targetMet: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/incubation-degree-days",
  title: "Incubation Degree-Days",
  description:
    "Integrate positive temperature above a supplied incubation base exactly across piecewise-linear timestamped temperatures; distinct from daily high/low crop degree-day approximations.",
  inputs: inputFields,
  outputs: [
    {
      id: "accumulatedDegreeDays",
      label: "Accumulated degree days",
      kind: "number",
    },
    {
      id: "remainingDegreeDays",
      label: "Remaining degree days",
      kind: "number",
    },
    { id: "targetMet", label: "Target met", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      timesDays: value.timesDays as readonly number[],
      temperaturesC: value.temperaturesC as readonly number[],
      baseTemperatureC: value.baseTemperatureC as number,
      targetDegreeDays: value.targetDegreeDays as number,
    }),
});
export const run = tool.execute;
export default tool;

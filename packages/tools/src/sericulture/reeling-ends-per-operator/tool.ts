import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly endBreaksPerHour: readonly number[];
  readonly handlingSecondsPerBreak: readonly number[];
  readonly operatorCount: number;
  readonly availableServiceFraction: number;
}>;
export type Output = Readonly<{
  readonly totalServiceDemandSecondsPerHour: number;
  readonly meanEndsPerOperator: number;
  readonly serviceUtilizationFraction: number;
  readonly callerCapacityMarginSecondsPerHour: number;
}>;
const inputFields = [
  { id: "endBreaksPerHour", label: "End breaks per hour", kind: "numberList" },
  {
    id: "handlingSecondsPerBreak",
    label: "Handling seconds per break",
    kind: "numberList",
  },
  { id: "operatorCount", label: "Operator count", kind: "integer" },
  {
    id: "availableServiceFraction",
    label: "Available service fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.operatorCount, "operatorCount");
  positive(input.availableServiceFraction, "availableServiceFraction");
  input.endBreaksPerHour.forEach((v) => nonnegative(v, "endBreaksPerHour"));
  input.handlingSecondsPerBreak.forEach((v) =>
    nonnegative(v, "handlingSecondsPerBreak"),
  );
  fraction(input.availableServiceFraction, "availableServiceFraction");
  count(input.operatorCount, "operatorCount");
  aligned(
    input.endBreaksPerHour,
    input.handlingSecondsPerBreak,
    "endBreaksPerHour",
  );
  const totalServiceDemandSecondsPerHour = input.endBreaksPerHour.reduce(
      (s, v, i) => s + v * input.handlingSecondsPerBreak[i],
      0,
    ),
    capacity = input.operatorCount * 3600 * input.availableServiceFraction;
  return {
    totalServiceDemandSecondsPerHour,
    meanEndsPerOperator: input.endBreaksPerHour.length / input.operatorCount,
    serviceUtilizationFraction: totalServiceDemandSecondsPerHour / capacity,
    callerCapacityMarginSecondsPerHour:
      capacity - totalServiceDemandSecondsPerHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  endBreaksPerHour: [1, 2, 3],
  handlingSecondsPerBreak: [10, 10, 20],
  operatorCount: 2,
  availableServiceFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  totalServiceDemandSecondsPerHour: 90,
  meanEndsPerOperator: 1.5,
  serviceUtilizationFraction: 0.025,
  callerCapacityMarginSecondsPerHour: 3510,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/reeling-ends-per-operator",
  title: "Reeling Ends Per Operator",
  description:
    "Screen reeling end/operator workload using end-specific break/handling demand and operator service availability; mean end allocation alone does not imply an acceptable queue or ergonomic workload.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalServiceDemandSecondsPerHour",
      label: "Total service demand seconds per hour",
      kind: "number",
    },
    {
      id: "meanEndsPerOperator",
      label: "Mean ends per operator",
      kind: "number",
    },
    {
      id: "serviceUtilizationFraction",
      label: "Service utilization fraction",
      kind: "number",
    },
    {
      id: "callerCapacityMarginSecondsPerHour",
      label: "Caller capacity margin seconds per hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      endBreaksPerHour: value.endBreaksPerHour as readonly number[],
      handlingSecondsPerBreak:
        value.handlingSecondsPerBreak as readonly number[],
      operatorCount: value.operatorCount as number,
      availableServiceFraction: value.availableServiceFraction as number,
    }),
});
export const run = tool.execute;
export default tool;

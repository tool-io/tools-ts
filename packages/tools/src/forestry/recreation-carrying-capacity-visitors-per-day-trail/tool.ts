import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerTrailOccupancyLimits: readonly number[];
  readonly callerMeanVisitHours: readonly number[];
  readonly callerOpenHours: readonly number[];
  readonly callerVerifiedSensitiveAreaDailyLimit: number;
}>;
export type Output = Readonly<{
  readonly componentDailyVisitorBounds: readonly number[];
  readonly bindingCallerDailyVisitorBound: number;
}>;
const inputFields = [
  {
    id: "callerTrailOccupancyLimits",
    label: "Caller trail occupancy limits",
    kind: "numberList",
  },
  {
    id: "callerMeanVisitHours",
    label: "Caller mean visit hours",
    kind: "numberList",
  },
  { id: "callerOpenHours", label: "Caller open hours", kind: "numberList" },
  {
    id: "callerVerifiedSensitiveAreaDailyLimit",
    label: "Caller verified sensitive area daily limit",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMeanVisitHours.forEach((v) =>
    positive(v, "callerMeanVisitHours"),
  );
  input.callerOpenHours.forEach((v) => positive(v, "callerOpenHours"));
  input.callerTrailOccupancyLimits.forEach((v) =>
    nonnegative(v, "callerTrailOccupancyLimits"),
  );
  nonnegative(
    input.callerVerifiedSensitiveAreaDailyLimit,
    "callerVerifiedSensitiveAreaDailyLimit",
  );
  aligned(
    input.callerTrailOccupancyLimits,
    input.callerMeanVisitHours,
    "callerTrailOccupancyLimits",
  );
  aligned(
    input.callerTrailOccupancyLimits,
    input.callerOpenHours,
    "callerTrailOccupancyLimits",
  );
  const capacities = input.callerTrailOccupancyLimits.map((v, i) =>
    Math.floor((v * input.callerOpenHours[i]) / input.callerMeanVisitHours[i]),
  );
  return {
    componentDailyVisitorBounds: capacities,
    bindingCallerDailyVisitorBound: Math.min(
      ...capacities,
      input.callerVerifiedSensitiveAreaDailyLimit,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTrailOccupancyLimits: [10, 20],
  callerMeanVisitHours: [1, 2],
  callerOpenHours: [8, 8],
  callerVerifiedSensitiveAreaDailyLimit: 50,
} satisfies Input;
export const exampleOutput = {
  componentDailyVisitorBounds: [80, 80],
  bindingCallerDailyVisitorBound: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/recreation-carrying-capacity-visitors-per-day-trail",
  title: "Trail Recreation Carrying Capacity Visitors/Day",
  description:
    "Budget caller independently established trail occupancy/exposure versus sensitive-area daily limit, use binding minimum not summed capacities; no ecological carrying-capacity discovery or access safety. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "componentDailyVisitorBounds",
      label: "Component daily visitor bounds",
      kind: "numberList",
    },
    {
      id: "bindingCallerDailyVisitorBound",
      label: "Binding caller daily visitor bound",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTrailOccupancyLimits:
        value.callerTrailOccupancyLimits as readonly number[],
      callerMeanVisitHours: value.callerMeanVisitHours as readonly number[],
      callerOpenHours: value.callerOpenHours as readonly number[],
      callerVerifiedSensitiveAreaDailyLimit:
        value.callerVerifiedSensitiveAreaDailyLimit as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  unique,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly dancerIds: readonly string[];
  readonly callerDancersPerGroup: number;
  readonly callerPassesPerDancer: number;
  readonly measuredGroupPassSeconds: number;
  readonly callerResetBetweenGroupPassesSeconds: number;
}>;
export type Output = Readonly<{
  readonly assignedGroupNumbers: readonly number[];
  readonly dancersPerGroup: readonly number[];
  readonly wholeGroupPassCount: number;
  readonly individualDancerPassCount: number;
  readonly estimatedFloorSessionSeconds: number;
}>;
const inputFields = [
  { id: "dancerIds", label: "Dancer ids", kind: "stringList" },
  {
    id: "callerDancersPerGroup",
    label: "Caller dancers per group",
    kind: "number",
  },
  {
    id: "callerPassesPerDancer",
    label: "Caller passes per dancer",
    kind: "number",
  },
  {
    id: "measuredGroupPassSeconds",
    label: "Measured group pass seconds",
    kind: "number",
  },
  {
    id: "callerResetBetweenGroupPassesSeconds",
    label: "Caller reset between group passes seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.dancerIds, "dancers");
  bounded(input.callerDancersPerGroup, "groupSize", 1, 128);
  bounded(input.callerPassesPerDancer, "passes", 1, 100);
  positive(input.measuredGroupPassSeconds, "passDuration");
  nonnegative(input.callerResetBetweenGroupPassesSeconds, "reset");
  const groups = Math.ceil(
      input.dancerIds.length / input.callerDancersPerGroup,
    ),
    passes = groups * input.callerPassesPerDancer;
  return {
    assignedGroupNumbers: input.dancerIds.map((_, i) =>
      Math.floor(i / input.callerDancersPerGroup),
    ),
    dancersPerGroup: Array.from({ length: groups }, (_, i) =>
      Math.min(
        input.callerDancersPerGroup,
        input.dancerIds.length - i * input.callerDancersPerGroup,
      ),
    ),
    wholeGroupPassCount: passes,
    individualDancerPassCount:
      input.dancerIds.length * input.callerPassesPerDancer,
    estimatedFloorSessionSeconds:
      passes * input.measuredGroupPassSeconds +
      (passes - 1) * input.callerResetBetweenGroupPassesSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dancerIds: ["A", "B", "C", "D", "E"],
  callerDancersPerGroup: 2,
  callerPassesPerDancer: 2,
  measuredGroupPassSeconds: 20,
  callerResetBetweenGroupPassesSeconds: 5,
} satisfies Input;
export const exampleOutput = {
  assignedGroupNumbers: [0, 0, 1, 1, 2],
  dancersPerGroup: [2, 2, 1],
  wholeGroupPassCount: 6,
  individualDancerPassCount: 10,
  estimatedFloorSessionSeconds: 145,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/across-the-floor-passes-per-group-math",
  title: "Across The Floor Passes Per Group Math",
  description:
    "Plan actual sequential across-floor groups including remainder and repeat passes with resets only between passes; no movement-speed, lane collision or participant readiness guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "assignedGroupNumbers",
      label: "Assigned group numbers",
      kind: "numberList",
    },
    { id: "dancersPerGroup", label: "Dancers per group", kind: "numberList" },
    {
      id: "wholeGroupPassCount",
      label: "Whole group pass count",
      kind: "number",
    },
    {
      id: "individualDancerPassCount",
      label: "Individual dancer pass count",
      kind: "number",
    },
    {
      id: "estimatedFloorSessionSeconds",
      label: "Estimated floor session seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dancerIds: value.dancerIds as readonly string[],
      callerDancersPerGroup: value.callerDancersPerGroup as number,
      callerPassesPerDancer: value.callerPassesPerDancer as number,
      measuredGroupPassSeconds: value.measuredGroupPassSeconds as number,
      callerResetBetweenGroupPassesSeconds:
        value.callerResetBetweenGroupPassesSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  bounded,
  aligned,
  weightedMinor,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerBenchmarkValuesMinor: readonly number[];
  readonly callerPlanningBasisPoints: readonly number[];
  readonly selectedBenchmarkIndex: number;
  readonly callerPerformanceMaterialityBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly planningMaterialityCandidatesMinor: readonly number[];
  readonly selectedPlanningMaterialityMinor: number;
  readonly callerPerformanceMaterialityMinor: number;
}>;
const inputFields = [
  {
    id: "callerBenchmarkValuesMinor",
    label: "Caller benchmark values minor",
    kind: "numberList",
  },
  {
    id: "callerPlanningBasisPoints",
    label: "Caller planning basis points",
    kind: "numberList",
  },
  {
    id: "selectedBenchmarkIndex",
    label: "Selected benchmark index",
    kind: "number",
  },
  {
    id: "callerPerformanceMaterialityBasisPoints",
    label: "Caller performance materiality basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerBenchmarkValuesMinor.forEach((v) =>
    money(v, "callerBenchmarkValuesMinor"),
  );
  aligned(
    input.callerBenchmarkValuesMinor,
    input.callerPlanningBasisPoints,
    "callerBenchmarkValuesMinor",
  );
  input.callerPlanningBasisPoints.forEach((v) =>
    bounded(v, "basisPoints", 0, 10000),
  );
  bounded(
    input.selectedBenchmarkIndex,
    "selection",
    0,
    input.callerBenchmarkValuesMinor.length - 1,
  );
  bounded(
    input.callerPerformanceMaterialityBasisPoints,
    "performance",
    0,
    10000,
  );
  const candidates = input.callerBenchmarkValuesMinor.map((v, i) =>
      weightedMinor(v, input.callerPlanningBasisPoints[i], 10000),
    ),
    selected = candidates[input.selectedBenchmarkIndex];
  return {
    planningMaterialityCandidatesMinor: candidates,
    selectedPlanningMaterialityMinor: selected,
    callerPerformanceMaterialityMinor: weightedMinor(
      selected,
      input.callerPerformanceMaterialityBasisPoints,
      10000,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBenchmarkValuesMinor: [10000, 20000],
  callerPlanningBasisPoints: [500, 100],
  selectedBenchmarkIndex: 0,
  callerPerformanceMaterialityBasisPoints: 7500,
} satisfies Input;
export const exampleOutput = {
  planningMaterialityCandidatesMinor: [500, 200],
  selectedPlanningMaterialityMinor: 500,
  callerPerformanceMaterialityMinor: 375,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/materiality-planning-percent-benchmark-lookup",
  title: "Materiality Planning Percent Benchmark Lookup",
  description:
    "Compute observed benchmark/rate planning candidates and explicitly selected caller performance materiality policy; no universal audit percentage, benchmark recommendation or professional-judgment substitution.",
  inputs: inputFields,
  outputs: [
    {
      id: "planningMaterialityCandidatesMinor",
      label: "Planning materiality candidates minor",
      kind: "numberList",
    },
    {
      id: "selectedPlanningMaterialityMinor",
      label: "Selected planning materiality minor",
      kind: "number",
    },
    {
      id: "callerPerformanceMaterialityMinor",
      label: "Caller performance materiality minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerBenchmarkValuesMinor:
        value.callerBenchmarkValuesMinor as readonly number[],
      callerPlanningBasisPoints:
        value.callerPlanningBasisPoints as readonly number[],
      selectedBenchmarkIndex: value.selectedBenchmarkIndex as number,
      callerPerformanceMaterialityBasisPoints:
        value.callerPerformanceMaterialityBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;

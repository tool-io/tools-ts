import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  positive,
  nonnegative,
  bounded,
  sumMoney,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly measuredSampleTrimLengthYards: number;
  readonly measuredSampleRhinestoneCount: number;
  readonly plannedCostumeTrimLengthsYards: readonly number[];
  readonly callerWholeSpareRhinestones: number;
  readonly availableRhinestoneCount: number;
}>;
export type Output = Readonly<{
  readonly calibratedRhinestonesPerYard: number;
  readonly wholeRhinestoneCountsByCostume: readonly number[];
  readonly totalRequiredWithSpares: number;
  readonly signedRhinestoneInventoryMargin: number;
}>;
const inputFields = [
  {
    id: "measuredSampleTrimLengthYards",
    label: "Measured sample trim length yards",
    kind: "number",
  },
  {
    id: "measuredSampleRhinestoneCount",
    label: "Measured sample rhinestone count",
    kind: "number",
  },
  {
    id: "plannedCostumeTrimLengthsYards",
    label: "Planned costume trim lengths yards",
    kind: "numberList",
  },
  {
    id: "callerWholeSpareRhinestones",
    label: "Caller whole spare rhinestones",
    kind: "number",
  },
  {
    id: "availableRhinestoneCount",
    label: "Available rhinestone count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.measuredSampleTrimLengthYards,
    "measuredSampleTrimLengthYards",
  );
  input.plannedCostumeTrimLengthsYards.forEach((v) =>
    nonnegative(v, "plannedCostumeTrimLengthsYards"),
  );
  bounded(input.measuredSampleRhinestoneCount, "sampleCount", 0, 1000000);
  bounded(input.callerWholeSpareRhinestones, "spares", 0, 1000000);
  bounded(input.availableRhinestoneCount, "inventory", 0, 1000000);
  const rate =
      input.measuredSampleRhinestoneCount / input.measuredSampleTrimLengthYards,
    counts = input.plannedCostumeTrimLengthsYards.map((v) =>
      integer(Math.ceil(rate * v), "stones"),
    ),
    required = sumMoney([...counts, input.callerWholeSpareRhinestones]);
  return {
    calibratedRhinestonesPerYard: rate,
    wholeRhinestoneCountsByCostume: counts,
    totalRequiredWithSpares: required,
    signedRhinestoneInventoryMargin: input.availableRhinestoneCount - required,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredSampleTrimLengthYards: 0.5,
  measuredSampleRhinestoneCount: 20,
  plannedCostumeTrimLengthsYards: [1, 2],
  callerWholeSpareRhinestones: 5,
  availableRhinestoneCount: 100,
} satisfies Input;
export const exampleOutput = {
  calibratedRhinestonesPerYard: 40,
  wholeRhinestoneCountsByCostume: [40, 80],
  totalRequiredWithSpares: 125,
  signedRhinestoneInventoryMargin: -25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/rhinestone-count-per-yard-costume-estimate",
  title: "Rhinestone Count Per Yard Costume Estimate",
  description:
    "Estimate actual calibrated rhinestone trim density per costume with whole counts, caller spares and inventory deficit; no universal stone spacing, adhesive method or material safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedRhinestonesPerYard",
      label: "Calibrated rhinestones per yard",
      kind: "number",
    },
    {
      id: "wholeRhinestoneCountsByCostume",
      label: "Whole rhinestone counts by costume",
      kind: "numberList",
    },
    {
      id: "totalRequiredWithSpares",
      label: "Total required with spares",
      kind: "number",
    },
    {
      id: "signedRhinestoneInventoryMargin",
      label: "Signed rhinestone inventory margin",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredSampleTrimLengthYards:
        value.measuredSampleTrimLengthYards as number,
      measuredSampleRhinestoneCount:
        value.measuredSampleRhinestoneCount as number,
      plannedCostumeTrimLengthsYards:
        value.plannedCostumeTrimLengthsYards as readonly number[],
      callerWholeSpareRhinestones: value.callerWholeSpareRhinestones as number,
      availableRhinestoneCount: value.availableRhinestoneCount as number,
    }),
});
export const run = tool.execute;
export default tool;

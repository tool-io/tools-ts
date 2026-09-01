import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  capacity,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerDrainPipeSkuIds: readonly string[];
  readonly callerVerifiedMatchedDrainageCapacityLitersSecond: readonly number[];
  readonly callerMeasuredPeakWasteLitersSecond: number;
}>;
export type Output = Readonly<{
  readonly callerCompatibleCandidateIds: readonly string[];
  readonly signedCandidateCapacityMarginsLitersSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "callerDrainPipeSkuIds",
    label: "Caller drain pipe sku ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMatchedDrainageCapacityLitersSecond",
    label: "Caller verified matched drainage capacity liters second",
    kind: "numberList",
  },
  {
    id: "callerMeasuredPeakWasteLitersSecond",
    label: "Caller measured peak waste liters second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedMatchedDrainageCapacityLitersSecond.forEach((v) =>
    nonnegative(v, "callerVerifiedMatchedDrainageCapacityLitersSecond"),
  );
  nonnegative(
    input.callerMeasuredPeakWasteLitersSecond,
    "callerMeasuredPeakWasteLitersSecond",
  );
  return {
    callerCompatibleCandidateIds: capacity(
      input.callerDrainPipeSkuIds,
      input.callerVerifiedMatchedDrainageCapacityLitersSecond,
      input.callerMeasuredPeakWasteLitersSecond,
    ),
    signedCandidateCapacityMarginsLitersSecond:
      input.callerVerifiedMatchedDrainageCapacityLitersSecond.map(
        (v) => v - input.callerMeasuredPeakWasteLitersSecond,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDrainPipeSkuIds: ["a", "b", "c"],
  callerVerifiedMatchedDrainageCapacityLitersSecond: [5, 10, 20],
  callerMeasuredPeakWasteLitersSecond: 8,
} satisfies Input;
export const exampleOutput = {
  callerCompatibleCandidateIds: ["b", "c"],
  signedCandidateCapacityMarginsLitersSecond: [-3, 2, 12],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/drain-pipe-sizing",
  title: "Plumbing Drain Pipe Sizing Calculator",
  description:
    "Screen actual drain pipe SKU matched slope/roughness capacity against measured waste flow; not water supply capacity, universal fixture-unit sizing or overflow safety guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCompatibleCandidateIds",
      label: "Caller compatible candidate ids",
      kind: "stringList",
    },
    {
      id: "signedCandidateCapacityMarginsLitersSecond",
      label: "Signed candidate capacity margins liters second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerDrainPipeSkuIds: value.callerDrainPipeSkuIds as readonly string[],
      callerVerifiedMatchedDrainageCapacityLitersSecond:
        value.callerVerifiedMatchedDrainageCapacityLitersSecond as readonly number[],
      callerMeasuredPeakWasteLitersSecond:
        value.callerMeasuredPeakWasteLitersSecond as number,
    }),
});
export const run = tool.execute;
export default tool;

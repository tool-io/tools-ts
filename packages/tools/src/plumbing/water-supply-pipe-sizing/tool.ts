import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  capacity,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerSupplyPipeSkuIds: readonly string[];
  readonly callerVerifiedMatchedSupplyCapacityLitersMinute: readonly number[];
  readonly callerMeasuredPeakSupplyLitersMinute: number;
}>;
export type Output = Readonly<{
  readonly callerCompatibleCandidateIds: readonly string[];
  readonly signedCandidateCapacityMarginsLitersMinute: readonly number[];
}>;
const inputFields = [
  {
    id: "callerSupplyPipeSkuIds",
    label: "Caller supply pipe sku ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMatchedSupplyCapacityLitersMinute",
    label: "Caller verified matched supply capacity liters minute",
    kind: "numberList",
  },
  {
    id: "callerMeasuredPeakSupplyLitersMinute",
    label: "Caller measured peak supply liters minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedMatchedSupplyCapacityLitersMinute.forEach((v) =>
    nonnegative(v, "callerVerifiedMatchedSupplyCapacityLitersMinute"),
  );
  nonnegative(
    input.callerMeasuredPeakSupplyLitersMinute,
    "callerMeasuredPeakSupplyLitersMinute",
  );
  return {
    callerCompatibleCandidateIds: capacity(
      input.callerSupplyPipeSkuIds,
      input.callerVerifiedMatchedSupplyCapacityLitersMinute,
      input.callerMeasuredPeakSupplyLitersMinute,
    ),
    signedCandidateCapacityMarginsLitersMinute:
      input.callerVerifiedMatchedSupplyCapacityLitersMinute.map(
        (v) => v - input.callerMeasuredPeakSupplyLitersMinute,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSupplyPipeSkuIds: ["a", "b", "c"],
  callerVerifiedMatchedSupplyCapacityLitersMinute: [5, 10, 20],
  callerMeasuredPeakSupplyLitersMinute: 8,
} satisfies Input;
export const exampleOutput = {
  callerCompatibleCandidateIds: ["b", "c"],
  signedCandidateCapacityMarginsLitersMinute: [-3, 2, 12],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/water-supply-pipe-sizing",
  title: "Plumbing Water Supply Pipe Sizing Calculator",
  description:
    "Screen actual supply pipe SKUs under caller independently verified matched pressure/length/material capacity and measured peak supply flow; no inferred nominal diameter velocity, universal code table or hydraulic safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCompatibleCandidateIds",
      label: "Caller compatible candidate ids",
      kind: "stringList",
    },
    {
      id: "signedCandidateCapacityMarginsLitersMinute",
      label: "Signed candidate capacity margins liters minute",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSupplyPipeSkuIds: value.callerSupplyPipeSkuIds as readonly string[],
      callerVerifiedMatchedSupplyCapacityLitersMinute:
        value.callerVerifiedMatchedSupplyCapacityLitersMinute as readonly number[],
      callerMeasuredPeakSupplyLitersMinute:
        value.callerMeasuredPeakSupplyLitersMinute as number,
    }),
});
export const run = tool.execute;
export default tool;

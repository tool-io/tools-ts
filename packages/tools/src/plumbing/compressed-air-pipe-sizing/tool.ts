import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerCompressedAirPipeIds: readonly string[];
  readonly callerVerifiedMatchedActualFlowM3Minute: readonly number[];
  readonly callerVerifiedMatchedDropsKpa: readonly number[];
  readonly observedRequiredActualAirM3Minute: number;
  readonly callerMaximumDropKpa: number;
}>;
export type Output = Readonly<{
  readonly callerJointlyCompatibleAirPipeIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerCompressedAirPipeIds",
    label: "Caller compressed air pipe ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMatchedActualFlowM3Minute",
    label: "Caller verified matched actual flow m3 minute",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMatchedDropsKpa",
    label: "Caller verified matched drops kpa",
    kind: "numberList",
  },
  {
    id: "observedRequiredActualAirM3Minute",
    label: "Observed required actual air m3 minute",
    kind: "number",
  },
  {
    id: "callerMaximumDropKpa",
    label: "Caller maximum drop kpa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedMatchedActualFlowM3Minute.forEach((v) =>
    nonnegative(v, "callerVerifiedMatchedActualFlowM3Minute"),
  );
  input.callerVerifiedMatchedDropsKpa.forEach((v) =>
    nonnegative(v, "callerVerifiedMatchedDropsKpa"),
  );
  nonnegative(
    input.observedRequiredActualAirM3Minute,
    "observedRequiredActualAirM3Minute",
  );
  nonnegative(input.callerMaximumDropKpa, "callerMaximumDropKpa");
  aligned(
    input.callerCompressedAirPipeIds,
    input.callerVerifiedMatchedActualFlowM3Minute,
    "callerCompressedAirPipeIds",
  );
  aligned(
    input.callerCompressedAirPipeIds,
    input.callerVerifiedMatchedDropsKpa,
    "callerCompressedAirPipeIds",
  );
  unique(input.callerCompressedAirPipeIds, "pipes");
  return {
    callerJointlyCompatibleAirPipeIds: input.callerCompressedAirPipeIds.filter(
      (_, i) =>
        input.callerVerifiedMatchedActualFlowM3Minute[i] >=
          input.observedRequiredActualAirM3Minute &&
        input.callerVerifiedMatchedDropsKpa[i] <= input.callerMaximumDropKpa,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCompressedAirPipeIds: ["a", "b"],
  callerVerifiedMatchedActualFlowM3Minute: [5, 10],
  callerVerifiedMatchedDropsKpa: [10, 20],
  observedRequiredActualAirM3Minute: 8,
  callerMaximumDropKpa: 15,
} satisfies Input;
export const exampleOutput = {
  callerJointlyCompatibleAirPipeIds: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/compressed-air-pipe-sizing",
  title: "Plumbing Compressed Air Pipe Sizing Calculator",
  description:
    "Screen actual compressed-air pipe candidates jointly on independently verified matched actual-volume flow and pressure loss; standard/free air conversion external, no gas-network safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerJointlyCompatibleAirPipeIds",
      label: "Caller jointly compatible air pipe ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCompressedAirPipeIds:
        value.callerCompressedAirPipeIds as readonly string[],
      callerVerifiedMatchedActualFlowM3Minute:
        value.callerVerifiedMatchedActualFlowM3Minute as readonly number[],
      callerVerifiedMatchedDropsKpa:
        value.callerVerifiedMatchedDropsKpa as readonly number[],
      observedRequiredActualAirM3Minute:
        value.observedRequiredActualAirM3Minute as number,
      callerMaximumDropKpa: value.callerMaximumDropKpa as number,
    }),
});
export const run = tool.execute;
export default tool;

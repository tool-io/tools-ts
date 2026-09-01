import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  capacity,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerLowPressureGasPipeIds: readonly string[];
  readonly callerVerifiedMatchedGasFlowCapacityM3Hour: readonly number[];
  readonly observedLowPressureGasDemandM3Hour: number;
}>;
export type Output = Readonly<{
  readonly callerCompatibleCandidateIds: readonly string[];
  readonly signedCandidateCapacityMarginsM3Hour: readonly number[];
}>;
const inputFields = [
  {
    id: "callerLowPressureGasPipeIds",
    label: "Caller low pressure gas pipe ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMatchedGasFlowCapacityM3Hour",
    label: "Caller verified matched gas flow capacity m3 hour",
    kind: "numberList",
  },
  {
    id: "observedLowPressureGasDemandM3Hour",
    label: "Observed low pressure gas demand m3 hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedMatchedGasFlowCapacityM3Hour.forEach((v) =>
    nonnegative(v, "callerVerifiedMatchedGasFlowCapacityM3Hour"),
  );
  nonnegative(
    input.observedLowPressureGasDemandM3Hour,
    "observedLowPressureGasDemandM3Hour",
  );
  return {
    callerCompatibleCandidateIds: capacity(
      input.callerLowPressureGasPipeIds,
      input.callerVerifiedMatchedGasFlowCapacityM3Hour,
      input.observedLowPressureGasDemandM3Hour,
    ),
    signedCandidateCapacityMarginsM3Hour:
      input.callerVerifiedMatchedGasFlowCapacityM3Hour.map(
        (v) => v - input.observedLowPressureGasDemandM3Hour,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLowPressureGasPipeIds: ["a", "b", "c"],
  callerVerifiedMatchedGasFlowCapacityM3Hour: [5, 10, 20],
  observedLowPressureGasDemandM3Hour: 8,
} satisfies Input;
export const exampleOutput = {
  callerCompatibleCandidateIds: ["b", "c"],
  signedCandidateCapacityMarginsM3Hour: [-3, 2, 12],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/gas-pipe-sizing-low-pressure",
  title: "Plumbing Gas Pipe Sizing Low Pressure Calculator",
  description:
    "Screen actual low-pressure gas demand against independently verified same gas/length/inlet-pressure pipe capacities; no high-pressure/compressible formula, installation instructions or gas safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCompatibleCandidateIds",
      label: "Caller compatible candidate ids",
      kind: "stringList",
    },
    {
      id: "signedCandidateCapacityMarginsM3Hour",
      label: "Signed candidate capacity margins m3 hour",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerLowPressureGasPipeIds:
        value.callerLowPressureGasPipeIds as readonly string[],
      callerVerifiedMatchedGasFlowCapacityM3Hour:
        value.callerVerifiedMatchedGasFlowCapacityM3Hour as readonly number[],
      observedLowPressureGasDemandM3Hour:
        value.observedLowPressureGasDemandM3Hour as number,
    }),
});
export const run = tool.execute;
export default tool;

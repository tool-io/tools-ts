import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly requestedOutputVoltagesV: readonly number[];
  readonly loadResistanceOhms: number;
  readonly callerSourceCurrentLimitA: number;
  readonly callerSinkCurrentLimitA: number;
}>;
export type Output = Readonly<{
  readonly requestedLoadCurrentsA: readonly number[];
  readonly currentLimitedOutputVoltagesV: readonly number[];
  readonly sourceLimitExceededIndices: readonly number[];
  readonly sinkLimitExceededIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "requestedOutputVoltagesV",
    label: "Requested output voltages v",
    kind: "numberList",
  },
  { id: "loadResistanceOhms", label: "Load resistance ohms", kind: "number" },
  {
    id: "callerSourceCurrentLimitA",
    label: "Caller source current limit a",
    kind: "number",
  },
  {
    id: "callerSinkCurrentLimitA",
    label: "Caller sink current limit a",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.loadResistanceOhms, "loadResistanceOhms");
  nonnegative(input.callerSourceCurrentLimitA, "callerSourceCurrentLimitA");
  nonnegative(input.callerSinkCurrentLimitA, "callerSinkCurrentLimitA");
  const currents = input.requestedOutputVoltagesV.map(
      (v) => v / input.loadResistanceOhms,
    ),
    limited = currents.map(
      (i) =>
        Math.max(
          -input.callerSinkCurrentLimitA,
          Math.min(input.callerSourceCurrentLimitA, i),
        ) * input.loadResistanceOhms,
    );
  return {
    requestedLoadCurrentsA: currents,
    currentLimitedOutputVoltagesV: limited,
    sourceLimitExceededIndices: currents.flatMap((v, i) =>
      v > input.callerSourceCurrentLimitA ? [i] : [],
    ),
    sinkLimitExceededIndices: currents.flatMap((v, i) =>
      v < -input.callerSinkCurrentLimitA ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requestedOutputVoltagesV: [2, -2],
  loadResistanceOhms: 100,
  callerSourceCurrentLimitA: 0.01,
  callerSinkCurrentLimitA: 0.03,
} satisfies Input;
export const exampleOutput = {
  requestedLoadCurrentsA: [0.02, -0.02],
  currentLimitedOutputVoltagesV: [1, -2],
  sourceLimitExceededIndices: [0],
  sinkLimitExceededIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/opamp-output-current-limit",
  title: "Opamp Output Current Limit Calculator",
  description:
    "Screen requested opamp resistive-load voltages under explicit asymmetric source/sink current limits; ideal hard-current clamp, excludes rail swing, thermal behavior, reactive loads or device safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "requestedLoadCurrentsA",
      label: "Requested load currents a",
      kind: "numberList",
    },
    {
      id: "currentLimitedOutputVoltagesV",
      label: "Current limited output voltages v",
      kind: "numberList",
    },
    {
      id: "sourceLimitExceededIndices",
      label: "Source limit exceeded indices",
      kind: "numberList",
    },
    {
      id: "sinkLimitExceededIndices",
      label: "Sink limit exceeded indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      requestedOutputVoltagesV:
        value.requestedOutputVoltagesV as readonly number[],
      loadResistanceOhms: value.loadResistanceOhms as number,
      callerSourceCurrentLimitA: value.callerSourceCurrentLimitA as number,
      callerSinkCurrentLimitA: value.callerSinkCurrentLimitA as number,
    }),
});
export const run = tool.execute;
export default tool;

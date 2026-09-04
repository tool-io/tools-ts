import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerDetectionSeconds: number;
  readonly callerPremovementSeconds: number;
  readonly callerIndependentTravelSeconds: readonly number[];
  readonly callerIndependentExitServiceSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerScenarioExitCompletionSeconds: readonly number[];
  readonly maximumCallerScenarioCompletionSeconds: number;
}>;
const inputFields = [
  {
    id: "callerDetectionSeconds",
    label: "Caller detection seconds",
    kind: "number",
  },
  {
    id: "callerPremovementSeconds",
    label: "Caller premovement seconds",
    kind: "number",
  },
  {
    id: "callerIndependentTravelSeconds",
    label: "Caller independent travel seconds",
    kind: "numberList",
  },
  {
    id: "callerIndependentExitServiceSeconds",
    label: "Caller independent exit service seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerDetectionSeconds, "callerDetectionSeconds");
  nonnegative(input.callerPremovementSeconds, "callerPremovementSeconds");
  input.callerIndependentTravelSeconds.forEach((v) =>
    nonnegative(v, "callerIndependentTravelSeconds"),
  );
  input.callerIndependentExitServiceSeconds.forEach((v) =>
    nonnegative(v, "callerIndependentExitServiceSeconds"),
  );
  aligned(
    input.callerIndependentTravelSeconds,
    input.callerIndependentExitServiceSeconds,
    "callerIndependentTravelSeconds",
  );
  const times = input.callerIndependentTravelSeconds.map(
    (v, i) =>
      input.callerDetectionSeconds +
      input.callerPremovementSeconds +
      v +
      input.callerIndependentExitServiceSeconds[i],
  );
  return {
    callerScenarioExitCompletionSeconds: times,
    maximumCallerScenarioCompletionSeconds: Math.max(...times),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDetectionSeconds: 10,
  callerPremovementSeconds: 20,
  callerIndependentTravelSeconds: [30, 40],
  callerIndependentExitServiceSeconds: [5, 15],
} satisfies Input;
export const exampleOutput = {
  callerScenarioExitCompletionSeconds: [65, 85],
  maximumCallerScenarioCompletionSeconds: 85,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/evacuation-time",
  title: "Evacuation Time Calculator",
  description:
    "Explicit independently evaluated path travel/exit-service scenarios after detection/premovement, no queue interactions, escape safety or evacuation directive. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerScenarioExitCompletionSeconds",
      label: "Caller scenario exit completion seconds",
      kind: "numberList",
    },
    {
      id: "maximumCallerScenarioCompletionSeconds",
      label: "Maximum caller scenario completion seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerDetectionSeconds: value.callerDetectionSeconds as number,
      callerPremovementSeconds: value.callerPremovementSeconds as number,
      callerIndependentTravelSeconds:
        value.callerIndependentTravelSeconds as readonly number[],
      callerIndependentExitServiceSeconds:
        value.callerIndependentExitServiceSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

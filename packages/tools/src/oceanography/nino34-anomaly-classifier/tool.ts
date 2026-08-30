import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly monthlyNino34AnomaliesC: readonly number[];
  readonly runningWindowMonths: number;
  readonly callerWarmThresholdC: number;
  readonly callerColdThresholdC: number;
  readonly callerRequiredConsecutiveWindows: number;
}>;
export type Output = Readonly<{
  readonly runningMeanAnomaliesC: readonly number[];
  readonly windowPhaseCodes: readonly number[];
  readonly callerWarmEpisode: boolean;
  readonly callerColdEpisode: boolean;
}>;
const inputFields = [
  {
    id: "monthlyNino34AnomaliesC",
    label: "Monthly nino34 anomalies c",
    kind: "numberList",
  },
  {
    id: "runningWindowMonths",
    label: "Running window months",
    kind: "integer",
  },
  {
    id: "callerWarmThresholdC",
    label: "Caller warm threshold c",
    kind: "number",
  },
  {
    id: "callerColdThresholdC",
    label: "Caller cold threshold c",
    kind: "number",
  },
  {
    id: "callerRequiredConsecutiveWindows",
    label: "Caller required consecutive windows",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.runningWindowMonths, "runningWindowMonths");
  positive(
    input.callerRequiredConsecutiveWindows,
    "callerRequiredConsecutiveWindows",
  );
  count(input.runningWindowMonths, "runningWindowMonths");
  count(
    input.callerRequiredConsecutiveWindows,
    "callerRequiredConsecutiveWindows",
  );
  if (
    input.runningWindowMonths > input.monthlyNino34AnomaliesC.length ||
    input.callerColdThresholdC >= input.callerWarmThresholdC
  )
    simpleError(
      "policy",
      "Feasible running window and ordered cold/warm thresholds required.",
    );
  let sum = input.monthlyNino34AnomaliesC
      .slice(0, input.runningWindowMonths)
      .reduce((a, b) => a + b, 0),
    warm = 0,
    cold = 0,
    callerWarmEpisode = false,
    callerColdEpisode = false;
  const runningMeanAnomaliesC: number[] = [],
    windowPhaseCodes: number[] = [];
  for (
    let i = input.runningWindowMonths;
    i <= input.monthlyNino34AnomaliesC.length;
    i++
  ) {
    const v = sum / input.runningWindowMonths,
      c =
        v >= input.callerWarmThresholdC
          ? 1
          : v <= input.callerColdThresholdC
            ? -1
            : 0;
    runningMeanAnomaliesC.push(v);
    windowPhaseCodes.push(c);
    warm = c === 1 ? warm + 1 : 0;
    cold = c === -1 ? cold + 1 : 0;
    if (warm >= input.callerRequiredConsecutiveWindows)
      callerWarmEpisode = true;
    if (cold >= input.callerRequiredConsecutiveWindows)
      callerColdEpisode = true;
    if (i < input.monthlyNino34AnomaliesC.length)
      sum +=
        input.monthlyNino34AnomaliesC[i] -
        input.monthlyNino34AnomaliesC[i - input.runningWindowMonths];
  }
  return {
    runningMeanAnomaliesC,
    windowPhaseCodes,
    callerWarmEpisode,
    callerColdEpisode,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  monthlyNino34AnomaliesC: [1, 1, 1, 0, -1],
  runningWindowMonths: 3,
  callerWarmThresholdC: 0.5,
  callerColdThresholdC: -0.5,
  callerRequiredConsecutiveWindows: 2,
} satisfies Input;
export const exampleOutput = {
  runningMeanAnomaliesC: [1, 0.6666666666666666, 0],
  windowPhaseCodes: [1, 1, 0],
  callerWarmEpisode: true,
  callerColdEpisode: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/nino34-anomaly-classifier",
  title: "Nino34 Anomaly Classifier",
  description:
    "Screen supplied monthly Nino3.4 anomalies using a caller running-window/consecutive-phase policy; inputs must be contiguous months on one baseline and outputs are not an official ENSO designation.",
  inputs: inputFields,
  outputs: [
    {
      id: "runningMeanAnomaliesC",
      label: "Running mean anomalies c",
      kind: "numberList",
    },
    { id: "windowPhaseCodes", label: "Window phase codes", kind: "numberList" },
    { id: "callerWarmEpisode", label: "Caller warm episode", kind: "boolean" },
    { id: "callerColdEpisode", label: "Caller cold episode", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      monthlyNino34AnomaliesC:
        value.monthlyNino34AnomaliesC as readonly number[],
      runningWindowMonths: value.runningWindowMonths as number,
      callerWarmThresholdC: value.callerWarmThresholdC as number,
      callerColdThresholdC: value.callerColdThresholdC as number,
      callerRequiredConsecutiveWindows:
        value.callerRequiredConsecutiveWindows as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesHours: readonly number[];
  readonly relativeHumiditiesPercent: readonly number[];
  readonly callerExposureThresholdPercent: number;
  readonly callerAlertExposureHours: number;
}>;
export type Output = Readonly<{
  readonly exposureHoursAboveCallerThreshold: number;
  readonly maximumContinuousExposureHours: number;
  readonly callerExposureAlert: boolean;
}>;
const inputFields = [
  { id: "timesHours", label: "Times hours", kind: "numberList" },
  {
    id: "relativeHumiditiesPercent",
    label: "Relative humidities percent",
    kind: "numberList",
  },
  {
    id: "callerExposureThresholdPercent",
    label: "Caller exposure threshold percent",
    kind: "number",
  },
  {
    id: "callerAlertExposureHours",
    label: "Caller alert exposure hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.relativeHumiditiesPercent.forEach((v) =>
    nonnegative(v, "relativeHumiditiesPercent"),
  );
  nonnegative(
    input.callerExposureThresholdPercent,
    "callerExposureThresholdPercent",
  );
  nonnegative(input.callerAlertExposureHours, "callerAlertExposureHours");
  aligned(input.timesHours, input.relativeHumiditiesPercent, "timesHours");
  ordered(input.timesHours, "timesHours");
  if (
    input.callerExposureThresholdPercent > 100 ||
    input.relativeHumiditiesPercent.some((v) => v > 100)
  )
    simpleError(
      "relativeHumiditiesPercent",
      "RH and threshold within [0,100] required.",
    );
  let total = 0,
    run = 0,
    longest = 0;
  for (let i = 1; i < input.timesHours.length; i++) {
    const a = input.relativeHumiditiesPercent[i - 1],
      b = input.relativeHumiditiesPercent[i],
      h = input.timesHours[i] - input.timesHours[i - 1],
      t = input.callerExposureThresholdPercent;
    if (a > t && b > t) {
      total += h;
      run += h;
    } else if (a > t) {
      const span = (h * (a - t)) / (a - b);
      total += span;
      run += span;
      longest = Math.max(longest, run);
      run = 0;
    } else if (b > t) {
      const span = (h * (b - t)) / (b - a);
      total += span;
      run = span;
    } else run = 0;
    longest = Math.max(longest, run);
  }
  return {
    exposureHoursAboveCallerThreshold: total,
    maximumContinuousExposureHours: longest,
    callerExposureAlert: total > input.callerAlertExposureHours,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesHours: [0, 2, 4],
  relativeHumiditiesPercent: [70, 90, 70],
  callerExposureThresholdPercent: 80,
  callerAlertExposureHours: 1.5,
} satisfies Input;
export const exampleOutput = {
  exposureHoursAboveCallerThreshold: 2,
  maximumContinuousExposureHours: 2,
  callerExposureAlert: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/muscardine-humidity-risk-checker",
  title: "Muscardine Humidity Risk Checker",
  description:
    "Integrate linearly interpolated RH exposure above a caller muscardine monitoring threshold and longest continuous spell; does not diagnose infection or predict disease probability.",
  inputs: inputFields,
  outputs: [
    {
      id: "exposureHoursAboveCallerThreshold",
      label: "Exposure hours above caller threshold",
      kind: "number",
    },
    {
      id: "maximumContinuousExposureHours",
      label: "Maximum continuous exposure hours",
      kind: "number",
    },
    {
      id: "callerExposureAlert",
      label: "Caller exposure alert",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      timesHours: value.timesHours as readonly number[],
      relativeHumiditiesPercent:
        value.relativeHumiditiesPercent as readonly number[],
      callerExposureThresholdPercent:
        value.callerExposureThresholdPercent as number,
      callerAlertExposureHours: value.callerAlertExposureHours as number,
    }),
});
export const run = tool.execute;
export default tool;

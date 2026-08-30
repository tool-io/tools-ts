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
  runs,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedValues: readonly number[];
  readonly representedExposureHours: readonly number[];
  readonly callerAllowedLowerValue: number;
  readonly callerAllowedUpperValue: number;
}>;
export type Output = Readonly<{
  readonly breachSampleCount: number;
  readonly breachEpisodeCount: number;
  readonly breachExposureHours: number;
  readonly breachSeverityValueHours: number;
}>;
const inputFields = [
  { id: "observedValues", label: "Observed values", kind: "numberList" },
  {
    id: "representedExposureHours",
    label: "Represented exposure hours",
    kind: "numberList",
  },
  {
    id: "callerAllowedLowerValue",
    label: "Caller allowed lower value",
    kind: "number",
  },
  {
    id: "callerAllowedUpperValue",
    label: "Caller allowed upper value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedExposureHours.forEach((v) =>
    nonnegative(v, "representedExposureHours"),
  );
  aligned(
    input.observedValues,
    input.representedExposureHours,
    "observedValues",
  );
  if (input.callerAllowedUpperValue < input.callerAllowedLowerValue)
    simpleError("band", "Ordered caller excursion band required.");
  const x = input.observedValues.map((v) =>
      Math.max(
        0,
        input.callerAllowedLowerValue - v,
        v - input.callerAllowedUpperValue,
      ),
    ),
    r = runs(x.map((v) => v > 0));
  return {
    breachSampleCount: x.filter((v) => v > 0).length,
    breachEpisodeCount: r.starts.length,
    breachExposureHours: input.representedExposureHours.reduce(
      (s, v, i) => s + (x[i] > 0 ? v : 0),
      0,
    ),
    breachSeverityValueHours: x.reduce(
      (s, v, i) => s + v * input.representedExposureHours[i],
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedValues: [5, 12, 13, 5],
  representedExposureHours: [1, 2, 1, 3],
  callerAllowedLowerValue: 0,
  callerAllowedUpperValue: 10,
} satisfies Input;
export const exampleOutput = {
  breachSampleCount: 2,
  breachEpisodeCount: 1,
  breachExposureHours: 3,
  breachSeverityValueHours: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/excursion-alert-breach-counter",
  title: "Environmental Excursion Alert Threshold Breach Counter",
  description:
    "Retain environmental excursion sample count, contiguous episode count, actual exposure and magnitude×duration as different summaries; measurements represent declared intervals, not intersample interpolation or damage.",
  inputs: inputFields,
  outputs: [
    { id: "breachSampleCount", label: "Breach sample count", kind: "number" },
    { id: "breachEpisodeCount", label: "Breach episode count", kind: "number" },
    {
      id: "breachExposureHours",
      label: "Breach exposure hours",
      kind: "number",
    },
    {
      id: "breachSeverityValueHours",
      label: "Breach severity value hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedValues: value.observedValues as readonly number[],
      representedExposureHours:
        value.representedExposureHours as readonly number[],
      callerAllowedLowerValue: value.callerAllowedLowerValue as number,
      callerAllowedUpperValue: value.callerAllowedUpperValue as number,
    }),
});
export const run = tool.execute;
export default tool;

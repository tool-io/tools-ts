import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, aligned, ordered } from "../shared.js";

export type Input = Readonly<{
  readonly timesMinutes: readonly number[];
  readonly temperaturesC: readonly number[];
  readonly referenceTemperatureC: number;
  readonly zValueC: number;
}>;
export type Output = Readonly<{
  readonly equivalentReferenceMinutes: number;
  readonly intervalEquivalentMinutes: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.timesMinutes, input.temperaturesC, "timesMinutes");
  ordered(input.timesMinutes, "timesMinutes");
  if (input.timesMinutes.length < 2)
    simpleError(
      "timesMinutes",
      "At least two time-temperature observations required.",
    );
  positive(input.zValueC, "zValueC");
  const lethalRates = input.temperaturesC.map(
      (v) => 10 ** ((v - input.referenceTemperatureC) / input.zValueC),
    ),
    intervalEquivalentMinutes = lethalRates
      .slice(1)
      .map(
        (v, i) =>
          ((v + lethalRates[i]) / 2) *
          (input.timesMinutes[i + 1] - input.timesMinutes[i]),
      );
  return {
    equivalentReferenceMinutes: intervalEquivalentMinutes.reduce(
      (a, b) => a + b,
      0,
    ),
    intervalEquivalentMinutes,
  };
};
export const exampleInput = {
  timesMinutes: [0, 2, 4],
  temperaturesC: [121, 121, 111],
  referenceTemperatureC: 121,
  zValueC: 10,
} satisfies Input;
export const exampleOutput = {
  equivalentReferenceMinutes: 3.1,
  intervalEquivalentMinutes: [2, 1.1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/thermal-f0-profile-integral",
  title: "Thermal F0 Profile Integral",
  description:
    "Integrate a sampled thermal profile by trapezoidal lethality at supplied reference temperature and Z value; F0 alone does not validate sterilization.",
  inputs: [
    { id: "timesMinutes", label: "Times minutes", kind: "numberList" },
    { id: "temperaturesC", label: "Temperatures c", kind: "numberList" },
    {
      id: "referenceTemperatureC",
      label: "Reference temperature c",
      kind: "number",
    },
    { id: "zValueC", label: "Z value c", kind: "number" },
  ],
  outputs: [
    {
      id: "equivalentReferenceMinutes",
      label: "Equivalent reference minutes",
      kind: "number",
    },
    {
      id: "intervalEquivalentMinutes",
      label: "Interval equivalent minutes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      timesMinutes: value.timesMinutes as readonly number[],
      temperaturesC: value.temperaturesC as readonly number[],
      referenceTemperatureC: value.referenceTemperatureC as number,
      zValueC: value.zValueC as number,
    }),
});
export const run = tool.execute;
export default tool;

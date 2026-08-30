import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly benchHeightsM: readonly number[];
  readonly benchFaceAnglesDegrees: readonly number[];
  readonly interBenchBermWidthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalRiseM: number;
  readonly totalHorizontalRunM: number;
  readonly overallSlopeDegrees: number;
}>;
const inputFields = [
  { id: "benchHeightsM", label: "Bench heights m", kind: "numberList" },
  {
    id: "benchFaceAnglesDegrees",
    label: "Bench face angles degrees",
    kind: "numberList",
  },
  {
    id: "interBenchBermWidthsM",
    label: "Inter bench berm widths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.benchHeightsM.forEach((v) => positive(v, "benchHeightsM"));
  input.interBenchBermWidthsM.forEach((v) =>
    nonnegative(v, "interBenchBermWidthsM"),
  );
  aligned(input.benchHeightsM, input.benchFaceAnglesDegrees, "benchHeightsM");
  if (input.interBenchBermWidthsM.length !== input.benchHeightsM.length - 1)
    simpleError(
      "interBenchBermWidthsM",
      "One interior berm between benches required.",
    );
  input.benchFaceAnglesDegrees.forEach((v) => {
    if (v <= 0 || v >= 90)
      simpleError(
        "benchFaceAnglesDegrees",
        "Face angles strictly between 0 and 90 degrees required.",
      );
  });
  const totalRiseM = input.benchHeightsM.reduce((a, b) => a + b, 0),
    totalHorizontalRunM =
      input.benchHeightsM.reduce(
        (s, v, i) =>
          s + v / Math.tan((input.benchFaceAnglesDegrees[i] * Math.PI) / 180),
        0,
      ) + input.interBenchBermWidthsM.reduce((a, b) => a + b, 0);
  return {
    totalRiseM,
    totalHorizontalRunM,
    overallSlopeDegrees:
      (Math.atan2(totalRiseM, totalHorizontalRunM) * 180) / Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  benchHeightsM: [10, 10],
  benchFaceAnglesDegrees: [45, 45],
  interBenchBermWidthsM: [5],
} satisfies Input;
export const exampleOutput = {
  totalRiseM: 20,
  totalHorizontalRunM: 25,
  overallSlopeDegrees: 38.659808254090095,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/pit-slope-angle",
  title: "Pit Slope Angle",
  description:
    "Calculate geometric overall pit slope across faces and interior berms; no rock-mass stability or geotechnical acceptance is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "totalRiseM", label: "Total rise m", kind: "number" },
    {
      id: "totalHorizontalRunM",
      label: "Total horizontal run m",
      kind: "number",
    },
    {
      id: "overallSlopeDegrees",
      label: "Overall slope degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      benchHeightsM: value.benchHeightsM as readonly number[],
      benchFaceAnglesDegrees: value.benchFaceAnglesDegrees as readonly number[],
      interBenchBermWidthsM: value.interBenchBermWidthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

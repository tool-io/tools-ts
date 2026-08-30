import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, ordered } from "../shared.js";
export type Input = Readonly<{
  readonly sampleTimesHours: readonly number[];
  readonly temperaturesC: readonly number[];
  readonly callerChillingBandC: readonly number[];
}>;
export type Output = Readonly<{
  readonly integratedPiecewiseLinearChillingHours: number;
}>;
const inputFields = [
  { id: "sampleTimesHours", label: "Sample times hours", kind: "numberList" },
  { id: "temperaturesC", label: "Temperatures c", kind: "numberList" },
  {
    id: "callerChillingBandC",
    label: "Caller chilling band c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.sampleTimesHours, "sampleTimesHours");
  aligned(input.sampleTimesHours, input.temperaturesC, "samples");
  if (
    input.callerChillingBandC.length !== 2 ||
    input.callerChillingBandC[0] >= input.callerChillingBandC[1]
  )
    simpleError(
      "band",
      "Two increasing caller temperature band bounds required.",
    );
  let total = 0;
  const [lo, hi] = input.callerChillingBandC;
  for (let i = 1; i < input.sampleTimesHours.length; i++) {
    const a = input.temperaturesC[i - 1],
      b = input.temperaturesC[i],
      duration = input.sampleTimesHours[i] - input.sampleTimesHours[i - 1];
    if (a === b) {
      if (a >= lo && a <= hi) total += duration;
    } else {
      const x = (lo - a) / (b - a),
        y = (hi - a) / (b - a);
      total +=
        duration *
        Math.max(0, Math.min(1, Math.max(x, y)) - Math.max(0, Math.min(x, y)));
    }
  }
  return { integratedPiecewiseLinearChillingHours: total };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleTimesHours: [0, 2, 4],
  temperaturesC: [0, 10, 0],
  callerChillingBandC: [0, 5],
} satisfies Input;
export const exampleOutput = {
  integratedPiecewiseLinearChillingHours: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/chilling-hours",
  title: "Agriculture Chilling Hours",
  description:
    "Integrate actual time inside a caller chilling-temperature band assuming linear sample-to-sample temperature changes; not counting all intervals by a single point or dynamic/Utah chill portions.",
  inputs: inputFields,
  outputs: [
    {
      id: "integratedPiecewiseLinearChillingHours",
      label: "Integrated piecewise linear chilling hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleTimesHours: value.sampleTimesHours as readonly number[],
      temperaturesC: value.temperaturesC as readonly number[],
      callerChillingBandC: value.callerChillingBandC as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

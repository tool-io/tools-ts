import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  ordered,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredNodePositionsCm: readonly number[];
  readonly callerLongInternodeThresholdCm: number;
}>;
export type Output = Readonly<{
  readonly observedInternodeLengthsCm: readonly number[];
  readonly meanObservedInternodeLengthCm: number;
  readonly longInternodeFraction: number;
}>;
const inputFields = [
  {
    id: "measuredNodePositionsCm",
    label: "Measured node positions cm",
    kind: "numberList",
  },
  {
    id: "callerLongInternodeThresholdCm",
    label: "Caller long internode threshold cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerLongInternodeThresholdCm,
    "callerLongInternodeThresholdCm",
  );
  ordered(input.measuredNodePositionsCm, "positions");
  const observedInternodeLengthsCm = input.measuredNodePositionsCm
    .slice(1)
    .map((v, i) => v - input.measuredNodePositionsCm[i]);
  return {
    observedInternodeLengthsCm,
    meanObservedInternodeLengthCm: mean(observedInternodeLengthsCm),
    longInternodeFraction:
      observedInternodeLengthsCm.filter(
        (v) => v > input.callerLongInternodeThresholdCm,
      ).length / observedInternodeLengthsCm.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredNodePositionsCm: [0, 5, 15, 20],
  callerLongInternodeThresholdCm: 7,
} satisfies Input;
export const exampleOutput = {
  observedInternodeLengthsCm: [5, 10, 5],
  meanObservedInternodeLengthCm: 6.666666666666667,
  longInternodeFraction: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/internode-length-vigour-indicator",
  title: "Internode Length Vigour Indicator",
  description:
    "Audit measured adjacent node distances and fraction above caller internode threshold, not a fixed cultivar vigor score or original nodes inferred from cane length.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedInternodeLengthsCm",
      label: "Observed internode lengths cm",
      kind: "numberList",
    },
    {
      id: "meanObservedInternodeLengthCm",
      label: "Mean observed internode length cm",
      kind: "number",
    },
    {
      id: "longInternodeFraction",
      label: "Long internode fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredNodePositionsCm:
        value.measuredNodePositionsCm as readonly number[],
      callerLongInternodeThresholdCm:
        value.callerLongInternodeThresholdCm as number,
    }),
});
export const run = tool.execute;
export default tool;

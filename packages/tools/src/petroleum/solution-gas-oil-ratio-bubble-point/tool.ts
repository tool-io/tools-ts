import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAtBubblePointReleasedStockGasM3: readonly number[];
  readonly observedMatchedStockOilM3: readonly number[];
  readonly callerIndependentlyConfirmedBubblePointParcelFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownBubblePointSolutionGasOilRatio: number;
  readonly unassessedBubblePointParcelCount: number;
}>;
const inputFields = [
  {
    id: "observedAtBubblePointReleasedStockGasM3",
    label: "Observed at bubble point released stock gas m3",
    kind: "numberList",
  },
  {
    id: "observedMatchedStockOilM3",
    label: "Observed matched stock oil m3",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyConfirmedBubblePointParcelFlags",
    label: "Caller independently confirmed bubble point parcel flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedStockOilM3.forEach((v) =>
    positive(v, "observedMatchedStockOilM3"),
  );
  input.observedAtBubblePointReleasedStockGasM3.forEach((v) =>
    nonnegative(v, "observedAtBubblePointReleasedStockGasM3"),
  );
  binary(
    input.callerIndependentlyConfirmedBubblePointParcelFlags,
    "callerIndependentlyConfirmedBubblePointParcelFlags",
  );
  aligned(
    input.observedAtBubblePointReleasedStockGasM3,
    input.observedMatchedStockOilM3,
    "observedAtBubblePointReleasedStockGasM3",
  );
  aligned(
    input.observedAtBubblePointReleasedStockGasM3,
    input.callerIndependentlyConfirmedBubblePointParcelFlags,
    "observedAtBubblePointReleasedStockGasM3",
  );
  const gas = sum(
      input.observedAtBubblePointReleasedStockGasM3.filter(
        (_, i) => input.callerIndependentlyConfirmedBubblePointParcelFlags[i],
      ),
    ),
    oil = sum(
      input.observedMatchedStockOilM3.filter(
        (_, i) => input.callerIndependentlyConfirmedBubblePointParcelFlags[i],
      ),
    );
  positive(oil, "known bubble point parcels");
  return {
    knownBubblePointSolutionGasOilRatio: gas / oil,
    unassessedBubblePointParcelCount:
      input.callerIndependentlyConfirmedBubblePointParcelFlags.filter((v) => !v)
        .length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAtBubblePointReleasedStockGasM3: [2, 3],
  observedMatchedStockOilM3: [1, 2],
  callerIndependentlyConfirmedBubblePointParcelFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownBubblePointSolutionGasOilRatio: 2,
  unassessedBubblePointParcelCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/solution-gas-oil-ratio-bubble-point",
  title: "Petroleum Solution Gas Oil Ratio Bubble Point Calculator",
  description:
    "Audit actual independently confirmed bubble-point released solution gas versus matched stock oil, no free production-gas GOR substitution or Standing fluid constants. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownBubblePointSolutionGasOilRatio",
      label: "Known bubble point solution gas oil ratio",
      kind: "number",
    },
    {
      id: "unassessedBubblePointParcelCount",
      label: "Unassessed bubble point parcel count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAtBubblePointReleasedStockGasM3:
        value.observedAtBubblePointReleasedStockGasM3 as readonly number[],
      observedMatchedStockOilM3:
        value.observedMatchedStockOilM3 as readonly number[],
      callerIndependentlyConfirmedBubblePointParcelFlags:
        value.callerIndependentlyConfirmedBubblePointParcelFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

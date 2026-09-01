import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  strictlyIncreasing,
  band,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedCatchWireHeightsM: readonly number[];
  readonly callerMinimumVerticalWireGapM: number;
  readonly callerMaximumVerticalWireGapM: number;
}>;
export type Output = Readonly<{
  readonly observedVerticalCatchWireGapsM: readonly number[];
  readonly wireGapPairsOutsideCallerBand: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCatchWireHeightsM",
    label: "Observed catch wire heights m",
    kind: "numberList",
  },
  {
    id: "callerMinimumVerticalWireGapM",
    label: "Caller minimum vertical wire gap m",
    kind: "number",
  },
  {
    id: "callerMaximumVerticalWireGapM",
    label: "Caller maximum vertical wire gap m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMinimumVerticalWireGapM,
    "callerMinimumVerticalWireGapM",
  );
  nonnegative(
    input.callerMaximumVerticalWireGapM,
    "callerMaximumVerticalWireGapM",
  );
  strictlyIncreasing(input.observedCatchWireHeightsM, "heights");
  input.observedCatchWireHeightsM.forEach((v) => nonnegative(v, "height"));
  const gaps = input.observedCatchWireHeightsM
    .slice(1)
    .map((v, i) => v - input.observedCatchWireHeightsM[i]);
  band(
    0,
    input.callerMinimumVerticalWireGapM,
    input.callerMaximumVerticalWireGapM,
  );
  return {
    observedVerticalCatchWireGapsM: gaps,
    wireGapPairsOutsideCallerBand: gaps.flatMap((v, i) =>
      band(
        v,
        input.callerMinimumVerticalWireGapM,
        input.callerMaximumVerticalWireGapM,
      ) < 0
        ? [i]
        : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCatchWireHeightsM: [0.5, 1, 1.8],
  callerMinimumVerticalWireGapM: 0.4,
  callerMaximumVerticalWireGapM: 0.6,
} satisfies Input;
export const exampleOutput = {
  observedVerticalCatchWireGapsM: [0.5, 0.8],
  wireGapPairsOutsideCallerBand: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/catch-wire-levels-spacing",
  title: "Catch Wire Levels Spacing Calculator",
  description:
    "Audit actual observed vertical catch-wire levels under caller gap band; not equal-level layout, horizontal post bay loads or wire tension/safety design.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedVerticalCatchWireGapsM",
      label: "Observed vertical catch wire gaps m",
      kind: "numberList",
    },
    {
      id: "wireGapPairsOutsideCallerBand",
      label: "Wire gap pairs outside caller band",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCatchWireHeightsM:
        value.observedCatchWireHeightsM as readonly number[],
      callerMinimumVerticalWireGapM:
        value.callerMinimumVerticalWireGapM as number,
      callerMaximumVerticalWireGapM:
        value.callerMaximumVerticalWireGapM as number,
    }),
});
export const run = tool.execute;
export default tool;

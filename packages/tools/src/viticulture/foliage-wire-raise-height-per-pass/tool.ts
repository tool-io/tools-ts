import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedWireRaiseHeightsM: readonly number[];
  readonly observedWireRaiseDayOrdinals: readonly number[];
  readonly callerMaximumRaiseIncrementM: number;
}>;
export type Output = Readonly<{
  readonly observedRaiseIncrementsM: readonly number[];
  readonly observedRaiseRatesMDay: readonly number[];
  readonly raisePassesAboveCallerIncrementIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedWireRaiseHeightsM",
    label: "Observed wire raise heights m",
    kind: "numberList",
  },
  {
    id: "observedWireRaiseDayOrdinals",
    label: "Observed wire raise day ordinals",
    kind: "numberList",
  },
  {
    id: "callerMaximumRaiseIncrementM",
    label: "Caller maximum raise increment m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWireRaiseHeightsM.forEach((v) =>
    nonnegative(v, "observedWireRaiseHeightsM"),
  );
  nonnegative(
    input.callerMaximumRaiseIncrementM,
    "callerMaximumRaiseIncrementM",
  );
  aligned(
    input.observedWireRaiseHeightsM,
    input.observedWireRaiseDayOrdinals,
    "observedWireRaiseHeightsM",
  );
  strictlyIncreasing(input.observedWireRaiseDayOrdinals, "days");
  input.observedWireRaiseDayOrdinals.forEach((v) => nonnegative(v, "day"));
  const increments = input.observedWireRaiseHeightsM
    .slice(1)
    .map((v, i) => v - input.observedWireRaiseHeightsM[i]);
  return {
    observedRaiseIncrementsM: increments,
    observedRaiseRatesMDay: increments.map(
      (v, i) =>
        v /
        (input.observedWireRaiseDayOrdinals[i + 1] -
          input.observedWireRaiseDayOrdinals[i]),
    ),
    raisePassesAboveCallerIncrementIndices: increments.flatMap((v, i) =>
      v > input.callerMaximumRaiseIncrementM ? [i + 1] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWireRaiseHeightsM: [0.5, 0.8, 1.2],
  observedWireRaiseDayOrdinals: [0, 3, 7],
  callerMaximumRaiseIncrementM: 0.35,
} satisfies Input;
export const exampleOutput = {
  observedRaiseIncrementsM: [0.3, 0.4],
  observedRaiseRatesMDay: [0.1, 0.1],
  raisePassesAboveCallerIncrementIndices: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/foliage-wire-raise-height-per-pass",
  title: "Foliage Wire Raise Height Per Pass Calculator",
  description:
    "Audit actual foliage-wire raise pass chronology, signed height change and caller increment limit; not final level gaps, inferred shoot growth or raising/pruning recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRaiseIncrementsM",
      label: "Observed raise increments m",
      kind: "numberList",
    },
    {
      id: "observedRaiseRatesMDay",
      label: "Observed raise rates m day",
      kind: "numberList",
    },
    {
      id: "raisePassesAboveCallerIncrementIndices",
      label: "Raise passes above caller increment indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWireRaiseHeightsM:
        value.observedWireRaiseHeightsM as readonly number[],
      observedWireRaiseDayOrdinals:
        value.observedWireRaiseDayOrdinals as readonly number[],
      callerMaximumRaiseIncrementM:
        value.callerMaximumRaiseIncrementM as number,
    }),
});
export const run = tool.execute;
export default tool;

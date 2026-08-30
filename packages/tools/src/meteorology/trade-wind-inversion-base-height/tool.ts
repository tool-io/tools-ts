import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  ordered,
  runs,
} from "../shared.js";

export type Input = Readonly<{
  readonly observedHeightsM: readonly number[];
  readonly observedTemperaturesC: readonly number[];
  readonly callerMinimumInversionGradientCPerKm: number;
}>;
export type Output = Readonly<{
  readonly qualifyingInversionBaseHeightsM: readonly number[];
  readonly qualifyingInversionTopHeightsM: readonly number[];
  readonly firstObservedInversionBaseM: number;
  readonly inversionFound: boolean;
}>;
const inputFields = [
  { id: "observedHeightsM", label: "Observed heights m", kind: "numberList" },
  {
    id: "observedTemperaturesC",
    label: "Observed temperatures c",
    kind: "numberList",
  },
  {
    id: "callerMinimumInversionGradientCPerKm",
    label: "Caller minimum inversion gradient c per km",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMinimumInversionGradientCPerKm,
    "callerMinimumInversionGradientCPerKm",
  );
  aligned(
    input.observedHeightsM,
    input.observedTemperaturesC,
    "observedHeightsM",
  );
  ordered(input.observedHeightsM, "heights");
  const flags = input.observedTemperaturesC
      .slice(1)
      .map(
        (t, i) =>
          t > input.observedTemperaturesC[i] &&
          (1000 * (t - input.observedTemperaturesC[i])) /
            (input.observedHeightsM[i + 1] - input.observedHeightsM[i]) >=
            input.callerMinimumInversionGradientCPerKm,
      ),
    r = runs(flags),
    base = r.starts.map((i) => input.observedHeightsM[i]),
    top = r.starts.map((i, j) => input.observedHeightsM[i + r.lengths[j]]);
  return {
    qualifyingInversionBaseHeightsM: base,
    qualifyingInversionTopHeightsM: top,
    firstObservedInversionBaseM: base[0] ?? -1,
    inversionFound: base.length > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHeightsM: [0, 1000, 2000, 3000],
  observedTemperaturesC: [20, 10, 15, 10],
  callerMinimumInversionGradientCPerKm: 1,
} satisfies Input;
export const exampleOutput = {
  qualifyingInversionBaseHeightsM: [1000],
  qualifyingInversionTopHeightsM: [2000],
  firstObservedInversionBaseM: 1000,
  inversionFound: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/trade-wind-inversion-base-height",
  title: "Trade Wind Inversion Base Height Lookup",
  description:
    "Identify measured contiguous inversion layers at caller lapse threshold and report observed base/top brackets; no climatological trade-wind lookup or inference of inversion between unresolved samples.",
  inputs: inputFields,
  outputs: [
    {
      id: "qualifyingInversionBaseHeightsM",
      label: "Qualifying inversion base heights m",
      kind: "numberList",
    },
    {
      id: "qualifyingInversionTopHeightsM",
      label: "Qualifying inversion top heights m",
      kind: "numberList",
    },
    {
      id: "firstObservedInversionBaseM",
      label: "First observed inversion base m",
      kind: "number",
    },
    { id: "inversionFound", label: "Inversion found", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      observedHeightsM: value.observedHeightsM as readonly number[],
      observedTemperaturesC: value.observedTemperaturesC as readonly number[],
      callerMinimumInversionGradientCPerKm:
        value.callerMinimumInversionGradientCPerKm as number,
    }),
});
export const run = tool.execute;
export default tool;

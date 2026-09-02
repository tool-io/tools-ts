import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedLoadedBaleScaleKg: readonly number[];
  readonly matchedBaleCarrierTareKg: readonly number[];
  readonly observedBalesOnEachScale: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedBaleNetMassKg: readonly number[];
  readonly pooledMeanBaleKg: number;
}>;
const inputFields = [
  {
    id: "observedLoadedBaleScaleKg",
    label: "Observed loaded bale scale kg",
    kind: "numberList",
  },
  {
    id: "matchedBaleCarrierTareKg",
    label: "Matched bale carrier tare kg",
    kind: "numberList",
  },
  {
    id: "observedBalesOnEachScale",
    label: "Observed bales on each scale",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBalesOnEachScale.forEach((v) =>
    positive(v, "observedBalesOnEachScale"),
  );
  input.observedLoadedBaleScaleKg.forEach((v) =>
    nonnegative(v, "observedLoadedBaleScaleKg"),
  );
  input.matchedBaleCarrierTareKg.forEach((v) =>
    nonnegative(v, "matchedBaleCarrierTareKg"),
  );
  aligned(
    input.observedLoadedBaleScaleKg,
    input.matchedBaleCarrierTareKg,
    "observedLoadedBaleScaleKg",
  );
  aligned(
    input.observedLoadedBaleScaleKg,
    input.observedBalesOnEachScale,
    "observedLoadedBaleScaleKg",
  );
  input.observedBalesOnEachScale.forEach((v) => integer(v, "bales"));
  const masses = input.observedLoadedBaleScaleKg.map((v, i) =>
    nonnegative(v - input.matchedBaleCarrierTareKg[i], "net mass"),
  );
  return {
    observedBaleNetMassKg: masses,
    pooledMeanBaleKg: sum(masses) / sum(input.observedBalesOnEachScale),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLoadedBaleScaleKg: [100, 200],
  matchedBaleCarrierTareKg: [10, 20],
  observedBalesOnEachScale: [1, 2],
} satisfies Input;
export const exampleOutput = {
  observedBaleNetMassKg: [90, 180],
  pooledMeanBaleKg: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/hay-bale-weight",
  title: "Agriculture Hay Bale Weight Calculator",
  description:
    "Actual gross-minus-carrier tare batch evidence and count-weighted mean bale mass, not an assumed geometry/density estimator. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBaleNetMassKg",
      label: "Observed bale net mass kg",
      kind: "numberList",
    },
    { id: "pooledMeanBaleKg", label: "Pooled mean bale kg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedLoadedBaleScaleKg:
        value.observedLoadedBaleScaleKg as readonly number[],
      matchedBaleCarrierTareKg:
        value.matchedBaleCarrierTareKg as readonly number[],
      observedBalesOnEachScale:
        value.observedBalesOnEachScale as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

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
  fraction,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerEndpointGapEv: readonly number[];
  readonly callerMatchedBowingEv: number;
  readonly observedAlloyCompositionFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledPerovskiteGapEv: readonly number[];
}>;
const inputFields = [
  {
    id: "callerEndpointGapEv",
    label: "Caller endpoint gap ev",
    kind: "numberList",
  },
  {
    id: "callerMatchedBowingEv",
    label: "Caller matched bowing ev",
    kind: "number",
  },
  {
    id: "observedAlloyCompositionFractions",
    label: "Observed alloy composition fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerEndpointGapEv.forEach((v) => positive(v, "callerEndpointGapEv"));
  input.observedAlloyCompositionFractions.forEach((v) =>
    fraction(v, "observedAlloyCompositionFractions"),
  );
  if (input.callerEndpointGapEv.length !== 2)
    simpleError(
      "endpoints",
      "Two independently matched perovskite endmember gaps required.",
    );
  const gaps = input.observedAlloyCompositionFractions.map(
    (x) =>
      (1 - x) * input.callerEndpointGapEv[0] +
      x * input.callerEndpointGapEv[1] -
      input.callerMatchedBowingEv * x * (1 - x),
  );
  gaps.forEach((v) => positive(v, "gap"));
  return { modeledPerovskiteGapEv: gaps };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEndpointGapEv: [1, 2],
  callerMatchedBowingEv: 0.4,
  observedAlloyCompositionFractions: [0, 0.5, 1],
} satisfies Input;
export const exampleOutput = {
  modeledPerovskiteGapEv: [1, 1.4, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/perovskite-bandgap-vs-composition",
  title: "Semiconductor Perovskite Bandgap Vs Composition Calculator",
  description:
    "Evaluate caller matched perovskite alloy bowing at actual composition observations, signed bowing parameter explicit; no default AlGaN/InGaAs material coefficients or composition recipe.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledPerovskiteGapEv",
      label: "Modeled perovskite gap ev",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerEndpointGapEv: value.callerEndpointGapEv as readonly number[],
      callerMatchedBowingEv: value.callerMatchedBowingEv as number,
      observedAlloyCompositionFractions:
        value.observedAlloyCompositionFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

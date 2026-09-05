import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedRoundwoodStackSteres: readonly number[];
  readonly callerMatchedSolidFractions: readonly number[];
  readonly observedIndependentSolidM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledSolidRoundwoodM3: readonly number[];
  readonly signedMeasuredMinusModeledSolidM3: readonly number[];
}>;
const inputFields = [
  {
    id: "observedRoundwoodStackSteres",
    label: "Observed roundwood stack steres",
    kind: "numberList",
  },
  {
    id: "callerMatchedSolidFractions",
    label: "Caller matched solid fractions",
    kind: "numberList",
  },
  {
    id: "observedIndependentSolidM3",
    label: "Observed independent solid m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRoundwoodStackSteres.forEach((v) =>
    nonnegative(v, "observedRoundwoodStackSteres"),
  );
  input.observedIndependentSolidM3.forEach((v) =>
    nonnegative(v, "observedIndependentSolidM3"),
  );
  input.callerMatchedSolidFractions.forEach((v) =>
    fraction(v, "callerMatchedSolidFractions"),
  );
  aligned(
    input.observedRoundwoodStackSteres,
    input.callerMatchedSolidFractions,
    "observedRoundwoodStackSteres",
  );
  aligned(
    input.observedRoundwoodStackSteres,
    input.observedIndependentSolidM3,
    "observedRoundwoodStackSteres",
  );
  const solid = input.observedRoundwoodStackSteres.map(
    (v, i) => v * input.callerMatchedSolidFractions[i],
  );
  return {
    modeledSolidRoundwoodM3: solid,
    signedMeasuredMinusModeledSolidM3: solid.map(
      (v, i) => input.observedIndependentSolidM3[i] - v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRoundwoodStackSteres: [1, 2],
  callerMatchedSolidFractions: [0.5, 0.6],
  observedIndependentSolidM3: [0.4, 1.3],
} satisfies Input;
export const exampleOutput = {
  modeledSolidRoundwoodM3: [0.5, 1.2],
  signedMeasuredMinusModeledSolidM3: [-0.1, 0.1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/stere-to-cubic-meter-roundwood-conversion",
  title: "Stere to Cubic Meter Roundwood Converter",
  description:
    "Audit observed stere stack envelopes (1m³ each) through matched solid fractions against independent solid-volume measurements, not generic stack unit conversion. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledSolidRoundwoodM3",
      label: "Modeled solid roundwood m3",
      kind: "numberList",
    },
    {
      id: "signedMeasuredMinusModeledSolidM3",
      label: "Signed measured minus modeled solid m3",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRoundwoodStackSteres:
        value.observedRoundwoodStackSteres as readonly number[],
      callerMatchedSolidFractions:
        value.callerMatchedSolidFractions as readonly number[],
      observedIndependentSolidM3:
        value.observedIndependentSolidM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

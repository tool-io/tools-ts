import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  secants,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedWaterSaturationFractions: readonly number[];
  readonly callerMatchedWaterFractionalFlow: readonly number[];
  readonly observedTotalDarcyFluxMSecond: number;
  readonly callerMatchedEffectivePorosityFraction: number;
}>;
export type Output = Readonly<{
  readonly discreteBuckleyLeverettCharacteristicSpeedsMSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "observedWaterSaturationFractions",
    label: "Observed water saturation fractions",
    kind: "numberList",
  },
  {
    id: "callerMatchedWaterFractionalFlow",
    label: "Caller matched water fractional flow",
    kind: "numberList",
  },
  {
    id: "observedTotalDarcyFluxMSecond",
    label: "Observed total darcy flux m second",
    kind: "number",
  },
  {
    id: "callerMatchedEffectivePorosityFraction",
    label: "Caller matched effective porosity fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMatchedEffectivePorosityFraction,
    "callerMatchedEffectivePorosityFraction",
  );
  nonnegative(
    input.observedTotalDarcyFluxMSecond,
    "observedTotalDarcyFluxMSecond",
  );
  input.observedWaterSaturationFractions.forEach((v) =>
    fraction(v, "observedWaterSaturationFractions"),
  );
  input.callerMatchedWaterFractionalFlow.forEach((v) =>
    fraction(v, "callerMatchedWaterFractionalFlow"),
  );
  fraction(
    input.callerMatchedEffectivePorosityFraction,
    "callerMatchedEffectivePorosityFraction",
  );
  const derivative = secants(
    input.observedWaterSaturationFractions,
    input.callerMatchedWaterFractionalFlow,
  );
  return {
    discreteBuckleyLeverettCharacteristicSpeedsMSecond: derivative.map(
      (v) =>
        (input.observedTotalDarcyFluxMSecond /
          input.callerMatchedEffectivePorosityFraction) *
        v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWaterSaturationFractions: [0.1, 0.3, 0.5],
  callerMatchedWaterFractionalFlow: [0.1, 0.3, 0.7],
  observedTotalDarcyFluxMSecond: 2,
  callerMatchedEffectivePorosityFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  discreteBuckleyLeverettCharacteristicSpeedsMSecond: [4, 8],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/buckley-leverett-velocity",
  title: "Petroleum Buckley Leverett Velocity Calculator",
  description:
    "Named Buckley–Leverett q/(φA) dfw/dSw discrete characteristic speeds, independently supplied monotone saturation coordinates and shared scalar Darcy flux; not automatically selected shock or breakthrough velocity. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "discreteBuckleyLeverettCharacteristicSpeedsMSecond",
      label: "Discrete buckley leverett characteristic speeds m second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWaterSaturationFractions:
        value.observedWaterSaturationFractions as readonly number[],
      callerMatchedWaterFractionalFlow:
        value.callerMatchedWaterFractionalFlow as readonly number[],
      observedTotalDarcyFluxMSecond:
        value.observedTotalDarcyFluxMSecond as number,
      callerMatchedEffectivePorosityFraction:
        value.callerMatchedEffectivePorosityFraction as number,
    }),
});
export const run = tool.execute;
export default tool;

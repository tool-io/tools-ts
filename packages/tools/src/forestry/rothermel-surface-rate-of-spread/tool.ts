import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerReactionIntensityKwM2: number;
  readonly callerPropagatingFluxFraction: number;
  readonly callerWindFactor: number;
  readonly callerSlopeFactor: number;
  readonly observedFuelBedBulkKgM3: number;
  readonly callerEffectiveHeatingFraction: number;
  readonly callerHeatOfPreignitionKjKg: number;
}>;
export type Output = Readonly<{
  readonly rothermelModeledSurfaceSpreadMSecond: number;
}>;
const inputFields = [
  {
    id: "callerReactionIntensityKwM2",
    label: "Caller reaction intensity kw m2",
    kind: "number",
  },
  {
    id: "callerPropagatingFluxFraction",
    label: "Caller propagating flux fraction",
    kind: "number",
  },
  { id: "callerWindFactor", label: "Caller wind factor", kind: "number" },
  { id: "callerSlopeFactor", label: "Caller slope factor", kind: "number" },
  {
    id: "observedFuelBedBulkKgM3",
    label: "Observed fuel bed bulk kg m3",
    kind: "number",
  },
  {
    id: "callerEffectiveHeatingFraction",
    label: "Caller effective heating fraction",
    kind: "number",
  },
  {
    id: "callerHeatOfPreignitionKjKg",
    label: "Caller heat of preignition kj kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerReactionIntensityKwM2, "callerReactionIntensityKwM2");
  positive(input.observedFuelBedBulkKgM3, "observedFuelBedBulkKgM3");
  positive(
    input.callerEffectiveHeatingFraction,
    "callerEffectiveHeatingFraction",
  );
  positive(input.callerHeatOfPreignitionKjKg, "callerHeatOfPreignitionKjKg");
  nonnegative(input.callerWindFactor, "callerWindFactor");
  nonnegative(input.callerSlopeFactor, "callerSlopeFactor");
  fraction(
    input.callerPropagatingFluxFraction,
    "callerPropagatingFluxFraction",
  );
  fraction(
    input.callerEffectiveHeatingFraction,
    "callerEffectiveHeatingFraction",
  );
  return {
    rothermelModeledSurfaceSpreadMSecond:
      (input.callerReactionIntensityKwM2 *
        input.callerPropagatingFluxFraction *
        (1 + input.callerWindFactor + input.callerSlopeFactor)) /
      (input.observedFuelBedBulkKgM3 *
        input.callerEffectiveHeatingFraction *
        input.callerHeatOfPreignitionKjKg),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerReactionIntensityKwM2: 100,
  callerPropagatingFluxFraction: 0.1,
  callerWindFactor: 1,
  callerSlopeFactor: 0.5,
  observedFuelBedBulkKgM3: 10,
  callerEffectiveHeatingFraction: 0.5,
  callerHeatOfPreignitionKjKg: 100,
} satisfies Input;
export const exampleOutput = {
  rothermelModeledSurfaceSpreadMSecond: 0.05,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/rothermel-surface-rate-of-spread",
  title: "Rothermel Surface Rate of Spread Calculator",
  description:
    "Explicit Rothermel propagation balance IR ξ(1+φw+φs)/(ρb ε Qig) with independently established fuel/wind/slope factors in consistent kJ/kW/metre units, not Byram intensity or full fuel-model derivation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "rothermelModeledSurfaceSpreadMSecond",
      label: "Rothermel modeled surface spread m second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerReactionIntensityKwM2: value.callerReactionIntensityKwM2 as number,
      callerPropagatingFluxFraction:
        value.callerPropagatingFluxFraction as number,
      callerWindFactor: value.callerWindFactor as number,
      callerSlopeFactor: value.callerSlopeFactor as number,
      observedFuelBedBulkKgM3: value.observedFuelBedBulkKgM3 as number,
      callerEffectiveHeatingFraction:
        value.callerEffectiveHeatingFraction as number,
      callerHeatOfPreignitionKjKg: value.callerHeatOfPreignitionKjKg as number,
    }),
});
export const run = tool.execute;
export default tool;

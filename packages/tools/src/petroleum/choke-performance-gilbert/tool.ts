import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerGilbertConstant: number;
  readonly observedChokeSize64thsInch: number;
  readonly observedWellheadPsi: number;
  readonly observedGasLiquidScfBbl: number;
  readonly callerChokeExponent: number;
  readonly callerPressureExponent: number;
  readonly callerGasLiquidExponent: number;
  readonly observedIndependentLiquidBblDay: number;
}>;
export type Output = Readonly<{
  readonly callerCalibratedGilbertLiquidBblDay: number;
  readonly signedMeasuredMinusGilbertBblDay: number;
}>;
const inputFields = [
  {
    id: "callerGilbertConstant",
    label: "Caller gilbert constant",
    kind: "number",
  },
  {
    id: "observedChokeSize64thsInch",
    label: "Observed choke size64ths inch",
    kind: "number",
  },
  { id: "observedWellheadPsi", label: "Observed wellhead psi", kind: "number" },
  {
    id: "observedGasLiquidScfBbl",
    label: "Observed gas liquid scf bbl",
    kind: "number",
  },
  { id: "callerChokeExponent", label: "Caller choke exponent", kind: "number" },
  {
    id: "callerPressureExponent",
    label: "Caller pressure exponent",
    kind: "number",
  },
  {
    id: "callerGasLiquidExponent",
    label: "Caller gas liquid exponent",
    kind: "number",
  },
  {
    id: "observedIndependentLiquidBblDay",
    label: "Observed independent liquid bbl day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerGilbertConstant, "callerGilbertConstant");
  positive(input.observedChokeSize64thsInch, "observedChokeSize64thsInch");
  positive(input.observedWellheadPsi, "observedWellheadPsi");
  positive(input.observedGasLiquidScfBbl, "observedGasLiquidScfBbl");
  nonnegative(
    input.observedIndependentLiquidBblDay,
    "observedIndependentLiquidBblDay",
  );
  const rate =
    (input.callerGilbertConstant *
      input.observedChokeSize64thsInch ** input.callerChokeExponent *
      input.observedWellheadPsi ** input.callerPressureExponent) /
    input.observedGasLiquidScfBbl ** input.callerGasLiquidExponent;
  return {
    callerCalibratedGilbertLiquidBblDay: rate,
    signedMeasuredMinusGilbertBblDay:
      input.observedIndependentLiquidBblDay - rate,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerGilbertConstant: 1,
  observedChokeSize64thsInch: 2,
  observedWellheadPsi: 3,
  observedGasLiquidScfBbl: 4,
  callerChokeExponent: 2,
  callerPressureExponent: 1,
  callerGasLiquidExponent: 0.5,
  observedIndependentLiquidBblDay: 7,
} satisfies Input;
export const exampleOutput = {
  callerCalibratedGilbertLiquidBblDay: 6,
  signedMeasuredMinusGilbertBblDay: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/choke-performance-gilbert",
  title: "Petroleum Choke Performance Gilbert Calculator",
  description:
    "Audit actual choke trial against independently calibrated Gilbert-family empirical C d^a p^b/R^c with explicit64ths-inch/psi/scf-per-bbl/bbl-day units, no unverified Gilbert edition coefficients or choke setting. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCalibratedGilbertLiquidBblDay",
      label: "Caller calibrated gilbert liquid bbl day",
      kind: "number",
    },
    {
      id: "signedMeasuredMinusGilbertBblDay",
      label: "Signed measured minus gilbert bbl day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerGilbertConstant: value.callerGilbertConstant as number,
      observedChokeSize64thsInch: value.observedChokeSize64thsInch as number,
      observedWellheadPsi: value.observedWellheadPsi as number,
      observedGasLiquidScfBbl: value.observedGasLiquidScfBbl as number,
      callerChokeExponent: value.callerChokeExponent as number,
      callerPressureExponent: value.callerPressureExponent as number,
      callerGasLiquidExponent: value.callerGasLiquidExponent as number,
      observedIndependentLiquidBblDay:
        value.observedIndependentLiquidBblDay as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly appliedShearStressPa: number;
  readonly callerYieldStressPa: number;
  readonly plasticViscosityPaSeconds: number;
  readonly callerNegligibleYieldFraction: number;
}>;
export type Output = Readonly<{
  readonly binghamShearRatePerSecond: number;
  readonly yieldStressFractionOfApplied: number;
  readonly callerNewtonianApproximationAcceptable: boolean;
}>;
const inputFields = [
  {
    id: "appliedShearStressPa",
    label: "Applied shear stress pa",
    kind: "number",
  },
  {
    id: "callerYieldStressPa",
    label: "Caller yield stress pa",
    kind: "number",
  },
  {
    id: "plasticViscosityPaSeconds",
    label: "Plastic viscosity pa seconds",
    kind: "number",
  },
  {
    id: "callerNegligibleYieldFraction",
    label: "Caller negligible yield fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.plasticViscosityPaSeconds, "plasticViscosityPaSeconds");
  nonnegative(input.appliedShearStressPa, "appliedShearStressPa");
  nonnegative(input.callerYieldStressPa, "callerYieldStressPa");
  fraction(
    input.callerNegligibleYieldFraction,
    "callerNegligibleYieldFraction",
  );
  positive(input.appliedShearStressPa, "appliedShearStressPa");
  const yieldStressFractionOfApplied =
    input.callerYieldStressPa / input.appliedShearStressPa;
  return {
    binghamShearRatePerSecond:
      Math.max(0, input.appliedShearStressPa - input.callerYieldStressPa) /
      input.plasticViscosityPaSeconds,
    yieldStressFractionOfApplied,
    callerNewtonianApproximationAcceptable:
      yieldStressFractionOfApplied <= input.callerNegligibleYieldFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  appliedShearStressPa: 20,
  callerYieldStressPa: 10,
  plasticViscosityPaSeconds: 2,
  callerNegligibleYieldFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  binghamShearRatePerSecond: 5,
  yieldStressFractionOfApplied: 0.5,
  callerNewtonianApproximationAcceptable: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/newtonian-yield-stress-regime-checker",
  title: "Newtonian Yield Stress Regime Checker",
  description:
    "Screen caller negligible-yield approximation and ideal Bingham shear at applied stress; unyielded states return zero modeled shear, not a flow-safety determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "binghamShearRatePerSecond",
      label: "Bingham shear rate per second",
      kind: "number",
    },
    {
      id: "yieldStressFractionOfApplied",
      label: "Yield stress fraction of applied",
      kind: "number",
    },
    {
      id: "callerNewtonianApproximationAcceptable",
      label: "Caller newtonian approximation acceptable",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      appliedShearStressPa: value.appliedShearStressPa as number,
      callerYieldStressPa: value.callerYieldStressPa as number,
      plasticViscosityPaSeconds: value.plasticViscosityPaSeconds as number,
      callerNegligibleYieldFraction:
        value.callerNegligibleYieldFraction as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerEmpiricalShearBondM: number;
  readonly callerEmpiricalShearBondKPa: number;
  readonly slabWidthM: number;
  readonly effectiveDepthM: number;
  readonly shearSpanM: number;
  readonly longitudinalSheetAreaM2: number;
}>;
export type Output = Readonly<{ readonly callerMkCompositeShearBondN: number }>;
const inputFields = [
  {
    id: "callerEmpiricalShearBondM",
    label: "Caller empirical shear bond m",
    kind: "number",
  },
  {
    id: "callerEmpiricalShearBondKPa",
    label: "Caller empirical shear bond k pa",
    kind: "number",
  },
  { id: "slabWidthM", label: "Slab width m", kind: "number" },
  { id: "effectiveDepthM", label: "Effective depth m", kind: "number" },
  { id: "shearSpanM", label: "Shear span m", kind: "number" },
  {
    id: "longitudinalSheetAreaM2",
    label: "Longitudinal sheet area m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.slabWidthM, "slabWidthM");
  positive(input.effectiveDepthM, "effectiveDepthM");
  positive(input.shearSpanM, "shearSpanM");
  nonnegative(input.callerEmpiricalShearBondM, "callerEmpiricalShearBondM");
  nonnegative(input.callerEmpiricalShearBondKPa, "callerEmpiricalShearBondKPa");
  nonnegative(input.longitudinalSheetAreaM2, "longitudinalSheetAreaM2");
  return {
    callerMkCompositeShearBondN:
      input.slabWidthM *
      input.effectiveDepthM *
      ((input.callerEmpiricalShearBondM * input.longitudinalSheetAreaM2) /
        (input.slabWidthM * input.shearSpanM) +
        input.callerEmpiricalShearBondKPa),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEmpiricalShearBondM: 2,
  callerEmpiricalShearBondKPa: 10,
  slabWidthM: 1,
  effectiveDepthM: 0.2,
  shearSpanM: 2,
  longitudinalSheetAreaM2: 0.1,
} satisfies Input;
export const exampleOutput = {
  callerMkCompositeShearBondN: 2.02,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/composite-slab-shear-bond",
  title: "Composite Slab Shear Bond Calculator",
  description:
    "Explicit empirically calibrated m-k longitudinal shear-bond form with coherent caller coefficient units, not bare steel deck or stud capacity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMkCompositeShearBondN",
      label: "Caller mk composite shear bond n",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerEmpiricalShearBondM: value.callerEmpiricalShearBondM as number,
      callerEmpiricalShearBondKPa: value.callerEmpiricalShearBondKPa as number,
      slabWidthM: value.slabWidthM as number,
      effectiveDepthM: value.effectiveDepthM as number,
      shearSpanM: value.shearSpanM as number,
      longitudinalSheetAreaM2: value.longitudinalSheetAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;

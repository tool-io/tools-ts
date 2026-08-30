import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly iceThicknessM: number;
  readonly basalShearStressPa: number;
  readonly dynamicViscosityPaYears: number;
}>;
export type Output = Readonly<{
  readonly surfaceDeformationVelocityMPerYear: number;
  readonly depthMeanDeformationVelocityMPerYear: number;
  readonly deformationFluxPerUnitWidthM2PerYear: number;
}>;
const inputFields = [
  { id: "iceThicknessM", label: "Ice thickness m", kind: "number" },
  { id: "basalShearStressPa", label: "Basal shear stress pa", kind: "number" },
  {
    id: "dynamicViscosityPaYears",
    label: "Dynamic viscosity pa years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceThicknessM, "iceThicknessM");
  positive(input.dynamicViscosityPaYears, "dynamicViscosityPaYears");
  nonnegative(input.basalShearStressPa, "basalShearStressPa");
  const surfaceDeformationVelocityMPerYear =
      (input.basalShearStressPa * input.iceThicknessM) /
      (2 * input.dynamicViscosityPaYears),
    depthMeanDeformationVelocityMPerYear =
      (2 * surfaceDeformationVelocityMPerYear) / 3;
  return {
    surfaceDeformationVelocityMPerYear,
    depthMeanDeformationVelocityMPerYear,
    deformationFluxPerUnitWidthM2PerYear:
      depthMeanDeformationVelocityMPerYear * input.iceThicknessM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  iceThicknessM: 2,
  basalShearStressPa: 3,
  dynamicViscosityPaYears: 2,
} satisfies Input;
export const exampleOutput = {
  surfaceDeformationVelocityMPerYear: 1.5,
  depthMeanDeformationVelocityMPerYear: 1,
  deformationFluxPerUnitWidthM2PerYear: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/newtonian-slab-flow-rate",
  title: "Newtonian Slab Flow Rate",
  description:
    "Evaluate constant-viscosity inclined-slab deformation from supplied maximum basal shear stress; excludes basal sliding.",
  inputs: inputFields,
  outputs: [
    {
      id: "surfaceDeformationVelocityMPerYear",
      label: "Surface deformation velocity m per year",
      kind: "number",
    },
    {
      id: "depthMeanDeformationVelocityMPerYear",
      label: "Depth mean deformation velocity m per year",
      kind: "number",
    },
    {
      id: "deformationFluxPerUnitWidthM2PerYear",
      label: "Deformation flux per unit width m2 per year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      iceThicknessM: value.iceThicknessM as number,
      basalShearStressPa: value.basalShearStressPa as number,
      dynamicViscosityPaYears: value.dynamicViscosityPaYears as number,
    }),
});
export const run = tool.execute;
export default tool;

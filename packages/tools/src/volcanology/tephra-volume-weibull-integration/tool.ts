import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  simpson,
} from "../shared.js";
export type Input = Readonly<{
  readonly centerDepositThicknessM: number;
  readonly radialScaleM: number;
  readonly radialShapeExponent: number;
  readonly maximumRadiusM: number;
  readonly simpsonPanels: number;
  readonly denseRockDensityKgPerM3: number;
  readonly depositBulkDensityKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly integratedBulkTephraVolumeM3: number;
  readonly denseRockEquivalentVolumeM3: number;
}>;
const inputFields = [
  {
    id: "centerDepositThicknessM",
    label: "Center deposit thickness m",
    kind: "number",
  },
  { id: "radialScaleM", label: "Radial scale m", kind: "number" },
  { id: "radialShapeExponent", label: "Radial shape exponent", kind: "number" },
  { id: "maximumRadiusM", label: "Maximum radius m", kind: "number" },
  { id: "simpsonPanels", label: "Simpson panels", kind: "integer" },
  {
    id: "denseRockDensityKgPerM3",
    label: "Dense rock density kg per m3",
    kind: "number",
  },
  {
    id: "depositBulkDensityKgPerM3",
    label: "Deposit bulk density kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.radialScaleM, "radialScaleM");
  positive(input.radialShapeExponent, "radialShapeExponent");
  positive(input.denseRockDensityKgPerM3, "denseRockDensityKgPerM3");
  positive(input.depositBulkDensityKgPerM3, "depositBulkDensityKgPerM3");
  nonnegative(input.centerDepositThicknessM, "centerDepositThicknessM");
  nonnegative(input.maximumRadiusM, "maximumRadiusM");
  count(input.simpsonPanels, "simpsonPanels");
  const integratedBulkTephraVolumeM3 = simpson(
    (r) =>
      2 *
      Math.PI *
      r *
      input.centerDepositThicknessM *
      Math.exp(-((r / input.radialScaleM) ** input.radialShapeExponent)),
    0,
    input.maximumRadiusM,
    input.simpsonPanels,
  );
  return {
    integratedBulkTephraVolumeM3,
    denseRockEquivalentVolumeM3:
      (integratedBulkTephraVolumeM3 * input.depositBulkDensityKgPerM3) /
      input.denseRockDensityKgPerM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  centerDepositThicknessM: 1,
  radialScaleM: 10,
  radialShapeExponent: 2,
  maximumRadiusM: 20,
  simpsonPanels: 2048,
  denseRockDensityKgPerM3: 2000,
  depositBulkDensityKgPerM3: 1000,
} satisfies Input;
export const exampleOutput = {
  integratedBulkTephraVolumeM3: 308.40523770111423,
  denseRockEquivalentVolumeM3: 154.20261885055712,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/tephra-volume-weibull-integration",
  title: "Tephra Volume Weibull Integration",
  description:
    "Integrate axisymmetric Weibull-form radial tephra thickness to a supplied truncation radius by bounded Simpson quadrature; caller panels control approximation and no infinite-tail volume or mapped dispersal is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "integratedBulkTephraVolumeM3",
      label: "Integrated bulk tephra volume m3",
      kind: "number",
    },
    {
      id: "denseRockEquivalentVolumeM3",
      label: "Dense rock equivalent volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      centerDepositThicknessM: value.centerDepositThicknessM as number,
      radialScaleM: value.radialScaleM as number,
      radialShapeExponent: value.radialShapeExponent as number,
      maximumRadiusM: value.maximumRadiusM as number,
      simpsonPanels: value.simpsonPanels as number,
      denseRockDensityKgPerM3: value.denseRockDensityKgPerM3 as number,
      depositBulkDensityKgPerM3: value.depositBulkDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly waterDensityKgPerM3: number;
  readonly normalCurrentSpeedsMPerSecond: readonly number[];
  readonly projectedPanelAreasM2: readonly number[];
  readonly calibratedDragCoefficients: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedPanelForcesNewtons: readonly number[];
  readonly netNormalForceNewtons: number;
}>;
const inputFields = [
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "normalCurrentSpeedsMPerSecond",
    label: "Normal current speeds m per second",
    kind: "numberList",
  },
  {
    id: "projectedPanelAreasM2",
    label: "Projected panel areas m2",
    kind: "numberList",
  },
  {
    id: "calibratedDragCoefficients",
    label: "Calibrated drag coefficients",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  input.projectedPanelAreasM2.forEach((v) =>
    nonnegative(v, "projectedPanelAreasM2"),
  );
  input.calibratedDragCoefficients.forEach((v) =>
    nonnegative(v, "calibratedDragCoefficients"),
  );
  aligned(
    input.normalCurrentSpeedsMPerSecond,
    input.projectedPanelAreasM2,
    "normalCurrentSpeedsMPerSecond",
  );
  aligned(
    input.normalCurrentSpeedsMPerSecond,
    input.calibratedDragCoefficients,
    "normalCurrentSpeedsMPerSecond",
  );
  const signedPanelForcesNewtons = input.normalCurrentSpeedsMPerSecond.map(
    (v, i) =>
      0.5 *
      input.waterDensityKgPerM3 *
      input.projectedPanelAreasM2[i] *
      input.calibratedDragCoefficients[i] *
      v *
      Math.abs(v),
  );
  return {
    signedPanelForcesNewtons,
    netNormalForceNewtons: signedPanelForcesNewtons.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  waterDensityKgPerM3: 1000,
  normalCurrentSpeedsMPerSecond: [1, -2],
  projectedPanelAreasM2: [2, 1],
  calibratedDragCoefficients: [1, 0.5],
} satisfies Input;
export const exampleOutput = {
  signedPanelForcesNewtons: [1000, -1000],
  netNormalForceNewtons: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/cage-drag-force",
  title: "Cage Drag Force",
  description:
    "Sum signed collinear water-current drag across independently calibrated cage panels; area/coefficient must use consistent net-solidity basis and shielding/deformation are external.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedPanelForcesNewtons",
      label: "Signed panel forces newtons",
      kind: "numberList",
    },
    {
      id: "netNormalForceNewtons",
      label: "Net normal force newtons",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      normalCurrentSpeedsMPerSecond:
        value.normalCurrentSpeedsMPerSecond as readonly number[],
      projectedPanelAreasM2: value.projectedPanelAreasM2 as readonly number[],
      calibratedDragCoefficients:
        value.calibratedDragCoefficients as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

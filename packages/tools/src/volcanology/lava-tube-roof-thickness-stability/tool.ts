import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly unsupportedRoofSpanM: number;
  readonly roofThicknessM: number;
  readonly distributedDownwardLoadPa: number;
  readonly plateBendingCoefficient: number;
  readonly callerAllowableTensileStressPa: number;
}>;
export type Output = Readonly<{
  readonly modelBendingStressPa: number;
  readonly allowableStressMarginPa: number;
  readonly modelRequiredRoofThicknessM: number;
}>;
const inputFields = [
  {
    id: "unsupportedRoofSpanM",
    label: "Unsupported roof span m",
    kind: "number",
  },
  { id: "roofThicknessM", label: "Roof thickness m", kind: "number" },
  {
    id: "distributedDownwardLoadPa",
    label: "Distributed downward load pa",
    kind: "number",
  },
  {
    id: "plateBendingCoefficient",
    label: "Plate bending coefficient",
    kind: "number",
  },
  {
    id: "callerAllowableTensileStressPa",
    label: "Caller allowable tensile stress pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.unsupportedRoofSpanM, "unsupportedRoofSpanM");
  positive(input.roofThicknessM, "roofThicknessM");
  positive(input.plateBendingCoefficient, "plateBendingCoefficient");
  positive(
    input.callerAllowableTensileStressPa,
    "callerAllowableTensileStressPa",
  );
  nonnegative(input.distributedDownwardLoadPa, "distributedDownwardLoadPa");
  const modelBendingStressPa =
    input.plateBendingCoefficient *
    input.distributedDownwardLoadPa *
    (input.unsupportedRoofSpanM / input.roofThicknessM) ** 2;
  return {
    modelBendingStressPa,
    allowableStressMarginPa:
      input.callerAllowableTensileStressPa - modelBendingStressPa,
    modelRequiredRoofThicknessM:
      input.unsupportedRoofSpanM *
      Math.sqrt(
        (input.plateBendingCoefficient * input.distributedDownwardLoadPa) /
          input.callerAllowableTensileStressPa,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  unsupportedRoofSpanM: 2,
  roofThicknessM: 0.5,
  distributedDownwardLoadPa: 1000,
  plateBendingCoefficient: 0.75,
  callerAllowableTensileStressPa: 10000,
} satisfies Input;
export const exampleOutput = {
  modelBendingStressPa: 12000,
  allowableStressMarginPa: -2000,
  modelRequiredRoofThicknessM: 0.5477225575051661,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/lava-tube-roof-thickness-stability",
  title: "Lava Tube Roof Thickness Stability Checker",
  description:
    "Screen a caller plate-bending lava-tube roof idealization and invert allowable stress to thickness; coefficient depends on support geometry, and hot/cracked roof stability or access safety is not certified.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelBendingStressPa",
      label: "Model bending stress pa",
      kind: "number",
    },
    {
      id: "allowableStressMarginPa",
      label: "Allowable stress margin pa",
      kind: "number",
    },
    {
      id: "modelRequiredRoofThicknessM",
      label: "Model required roof thickness m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      unsupportedRoofSpanM: value.unsupportedRoofSpanM as number,
      roofThicknessM: value.roofThicknessM as number,
      distributedDownwardLoadPa: value.distributedDownwardLoadPa as number,
      plateBendingCoefficient: value.plateBendingCoefficient as number,
      callerAllowableTensileStressPa:
        value.callerAllowableTensileStressPa as number,
    }),
});
export const run = tool.execute;
export default tool;

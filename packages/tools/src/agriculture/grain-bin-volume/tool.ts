import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly binInternalRadiusM: number;
  readonly cylinderUsableHeightM: number;
  readonly observedConeHeapHeightM: number;
  readonly independentlyOccupiedBinVolumeM3: number;
}>;
export type Output = Readonly<{ readonly netGrainBinVolumeM3: number }>;
const inputFields = [
  { id: "binInternalRadiusM", label: "Bin internal radius m", kind: "number" },
  {
    id: "cylinderUsableHeightM",
    label: "Cylinder usable height m",
    kind: "number",
  },
  {
    id: "observedConeHeapHeightM",
    label: "Observed cone heap height m",
    kind: "number",
  },
  {
    id: "independentlyOccupiedBinVolumeM3",
    label: "Independently occupied bin volume m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.binInternalRadiusM, "binInternalRadiusM");
  nonnegative(input.cylinderUsableHeightM, "cylinderUsableHeightM");
  nonnegative(input.observedConeHeapHeightM, "observedConeHeapHeightM");
  nonnegative(
    input.independentlyOccupiedBinVolumeM3,
    "independentlyOccupiedBinVolumeM3",
  );
  const net =
    Math.PI *
      input.binInternalRadiusM ** 2 *
      (input.cylinderUsableHeightM + input.observedConeHeapHeightM / 3) -
    input.independentlyOccupiedBinVolumeM3;
  nonnegative(net, "unoccupied bin volume");
  return { netGrainBinVolumeM3: net };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  binInternalRadiusM: 2,
  cylinderUsableHeightM: 3,
  observedConeHeapHeightM: 1,
  independentlyOccupiedBinVolumeM3: 2,
} satisfies Input;
export const exampleOutput = {
  netGrainBinVolumeM3: 39.88790204786391,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/grain-bin-volume",
  title: "Agriculture Grain Bin Volume Calculator",
  description:
    "Actual cylinder-plus-conical heap minus independently occupied volume, no single-cylinder duplicate or mass density assumption. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "netGrainBinVolumeM3",
      label: "Net grain bin volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      binInternalRadiusM: value.binInternalRadiusM as number,
      cylinderUsableHeightM: value.cylinderUsableHeightM as number,
      observedConeHeapHeightM: value.observedConeHeapHeightM as number,
      independentlyOccupiedBinVolumeM3:
        value.independentlyOccupiedBinVolumeM3 as number,
    }),
});
export const run = tool.execute;
export default tool;

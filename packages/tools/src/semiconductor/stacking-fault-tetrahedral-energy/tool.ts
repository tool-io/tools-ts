import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedTetrahedronEdgeM: number;
  readonly callerStackingFaultEnergyJM2: number;
  readonly callerMatchedEdgeLineEnergyJM: number;
}>;
export type Output = Readonly<{
  readonly modeledTetrahedralFaultFaceEnergyJ: number;
  readonly modeledTetrahedralFaultEdgeEnergyJ: number;
  readonly totalModeledFaultEnergyJ: number;
}>;
const inputFields = [
  {
    id: "observedTetrahedronEdgeM",
    label: "Observed tetrahedron edge m",
    kind: "number",
  },
  {
    id: "callerStackingFaultEnergyJM2",
    label: "Caller stacking fault energy j m2",
    kind: "number",
  },
  {
    id: "callerMatchedEdgeLineEnergyJM",
    label: "Caller matched edge line energy j m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedTetrahedronEdgeM, "observedTetrahedronEdgeM");
  nonnegative(
    input.callerStackingFaultEnergyJM2,
    "callerStackingFaultEnergyJM2",
  );
  nonnegative(
    input.callerMatchedEdgeLineEnergyJM,
    "callerMatchedEdgeLineEnergyJM",
  );
  const face =
      Math.sqrt(3) *
      input.observedTetrahedronEdgeM ** 2 *
      input.callerStackingFaultEnergyJM2,
    edges =
      6 * input.observedTetrahedronEdgeM * input.callerMatchedEdgeLineEnergyJM;
  return {
    modeledTetrahedralFaultFaceEnergyJ: face,
    modeledTetrahedralFaultEdgeEnergyJ: edges,
    totalModeledFaultEnergyJ: face + edges,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTetrahedronEdgeM: 2,
  callerStackingFaultEnergyJM2: 3,
  callerMatchedEdgeLineEnergyJM: 4,
} satisfies Input;
export const exampleOutput = {
  modeledTetrahedralFaultFaceEnergyJ: 20.784609690826528,
  modeledTetrahedralFaultEdgeEnergyJ: 48,
  totalModeledFaultEnergyJ: 68.78460969082653,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/stacking-fault-tetrahedral-energy",
  title: "Semiconductor Stacking Fault Tetrahedral Energy Calculator",
  description:
    "Budget explicit four-face regular stacking-fault tetrahedron with six matched edge line energies, not single planar fault or defect stability/nucleation claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledTetrahedralFaultFaceEnergyJ",
      label: "Modeled tetrahedral fault face energy j",
      kind: "number",
    },
    {
      id: "modeledTetrahedralFaultEdgeEnergyJ",
      label: "Modeled tetrahedral fault edge energy j",
      kind: "number",
    },
    {
      id: "totalModeledFaultEnergyJ",
      label: "Total modeled fault energy j",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTetrahedronEdgeM: value.observedTetrahedronEdgeM as number,
      callerStackingFaultEnergyJM2:
        value.callerStackingFaultEnergyJM2 as number,
      callerMatchedEdgeLineEnergyJM:
        value.callerMatchedEdgeLineEnergyJM as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualReadoutPixelMm: number;
  readonly actualPhasePixelMm: number;
  readonly actualSliceThicknessMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualReadoutPixelMm",
    label: "Actual readout pixel mm",
    kind: "number",
  },
  { id: "actualPhasePixelMm", label: "Actual phase pixel mm", kind: "number" },
  {
    id: "actualSliceThicknessMm",
    label: "Actual slice thickness mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualReadoutPixelMm, "actualReadoutPixelMm");
  positive(input.actualPhasePixelMm, "actualPhasePixelMm");
  positive(input.actualSliceThicknessMm, "actualSliceThicknessMm");
  return {
    value:
      input.actualReadoutPixelMm *
      input.actualPhasePixelMm *
      input.actualSliceThicknessMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualReadoutPixelMm: 2,
    actualPhasePixelMm: 3,
    actualSliceThicknessMm: 4,
  },
  output: { result: { value: 24 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/voxel-volume",
  title: "Voxel Volume Calculator",
  description:
    "Actual rectangular voxel volume mm\u00b3, thickness not slice gap/no in plane resolution or biological spatial accuracy guarantee.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

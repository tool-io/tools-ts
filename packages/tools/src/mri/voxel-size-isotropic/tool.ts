import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualVoxelVolumeCubicMillimeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualVoxelVolumeCubicMillimeters",
    label: "Actual voxel volume cubic millimeters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualVoxelVolumeCubicMillimeters,
    "actualVoxelVolumeCubicMillimeters",
  );
  return { value: Math.cbrt(input.actualVoxelVolumeCubicMillimeters) };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualVoxelVolumeCubicMillimeters: 8 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/voxel-size-isotropic",
  title: "Isotropic Voxel Size Calculator",
  description:
    "Equivalent isotropic voxel SIDE from actualvolumecuberootmm, no claim anisotropic data is isotropic/native resolution.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

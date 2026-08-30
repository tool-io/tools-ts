import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly phaseFovMm: number;
  readonly maximumPixelMm: number;
  readonly requiredMatrixMultiple: number;
}>;
export type Output = Readonly<{
  readonly phaseMatrixSize: number;
  readonly actualPixelMm: number;
}>;
const inputFields = [
  { id: "phaseFovMm", label: "Phase fov mm", kind: "number", unit: "mm" },
  {
    id: "maximumPixelMm",
    label: "Maximum pixel mm",
    kind: "number",
    unit: "mm",
  },
  {
    id: "requiredMatrixMultiple",
    label: "Required matrix multiple",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.phaseFovMm, "phaseFovMm");
  positive(input.maximumPixelMm, "maximumPixelMm");
  count(input.requiredMatrixMultiple, "requiredMatrixMultiple", 1);
  const phaseMatrixSize =
    Math.ceil(
      input.phaseFovMm / input.maximumPixelMm / input.requiredMatrixMultiple,
    ) * input.requiredMatrixMultiple;
  count(phaseMatrixSize, "maximumPixelMm", 1);
  return { phaseMatrixSize, actualPixelMm: input.phaseFovMm / phaseMatrixSize };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  phaseFovMm: 240,
  maximumPixelMm: 1.1,
  requiredMatrixMultiple: 8,
} satisfies Input;
export const exampleOutput = {
  phaseMatrixSize: 224,
  actualPixelMm: 1.0714285714285714,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/phase-resolution-matrix-plan",
  title: "Phase Matrix Size",
  description:
    "Plan the smallest phase matrix meeting a maximum nominal pixel size and caller hardware multiple; this does not estimate true reconstructed spatial resolution.",
  inputs: inputFields,
  outputs: [
    { id: "phaseMatrixSize", label: "Phase matrix size", kind: "number" },
    {
      id: "actualPixelMm",
      label: "Actual pixel mm",
      kind: "number",
      unit: "mm",
    },
  ],
  calculate: (value) =>
    calculate({
      phaseFovMm: value.phaseFovMm as number,
      maximumPixelMm: value.maximumPixelMm as number,
      requiredMatrixMultiple: value.requiredMatrixMultiple as number,
    }),
});
export const run = tool.execute;
export default tool;

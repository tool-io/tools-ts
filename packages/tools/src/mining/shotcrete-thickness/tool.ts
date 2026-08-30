import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly designPressureKpa: number;
  readonly curvatureRadiusM: number;
  readonly allowableCompressiveStressMpa: number;
  readonly designFactor: number;
}>;
export type Output = Readonly<{ readonly idealMembraneThicknessMm: number }>;
const inputFields = [
  { id: "designPressureKpa", label: "Design pressure kpa", kind: "number" },
  { id: "curvatureRadiusM", label: "Curvature radius m", kind: "number" },
  {
    id: "allowableCompressiveStressMpa",
    label: "Allowable compressive stress mpa",
    kind: "number",
  },
  { id: "designFactor", label: "Design factor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.designPressureKpa, "designPressureKpa");
  positive(input.curvatureRadiusM, "curvatureRadiusM");
  positive(
    input.allowableCompressiveStressMpa,
    "allowableCompressiveStressMpa",
  );
  if (input.designFactor < 1)
    simpleError("designFactor", "Factor at least one required.");
  return {
    idealMembraneThicknessMm:
      (input.designPressureKpa * input.curvatureRadiusM * input.designFactor) /
      input.allowableCompressiveStressMpa,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  designPressureKpa: 100,
  curvatureRadiusM: 2,
  allowableCompressiveStressMpa: 10,
  designFactor: 2,
} satisfies Input;
export const exampleOutput = { idealMembraneThicknessMm: 40 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/shotcrete-thickness",
  title: "Shotcrete Thickness",
  description:
    "Screen ideal cylindrical shotcrete membrane thickness by pressure×radius/allowable stress; excludes bending, early-age strength, bond and buckling.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealMembraneThicknessMm",
      label: "Ideal membrane thickness mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      designPressureKpa: value.designPressureKpa as number,
      curvatureRadiusM: value.curvatureRadiusM as number,
      allowableCompressiveStressMpa:
        value.allowableCompressiveStressMpa as number,
      designFactor: value.designFactor as number,
    }),
});
export const run = tool.execute;
export default tool;

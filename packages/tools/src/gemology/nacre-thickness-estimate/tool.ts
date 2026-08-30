import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly outerPearlRadiusMm: number;
  readonly nucleusRadiusMm: number;
  readonly nucleusCenterOffsetMm: number;
}>;
export type Output = Readonly<{
  readonly minimumModelNacreThicknessMm: number;
  readonly maximumModelNacreThicknessMm: number;
  readonly sphericalShellVolumeMm3: number;
}>;
const inputFields = [
  { id: "outerPearlRadiusMm", label: "Outer pearl radius mm", kind: "number" },
  { id: "nucleusRadiusMm", label: "Nucleus radius mm", kind: "number" },
  {
    id: "nucleusCenterOffsetMm",
    label: "Nucleus center offset mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.outerPearlRadiusMm, "outerPearlRadiusMm");
  nonnegative(input.nucleusRadiusMm, "nucleusRadiusMm");
  nonnegative(input.nucleusCenterOffsetMm, "nucleusCenterOffsetMm");
  if (
    input.nucleusRadiusMm + input.nucleusCenterOffsetMm >
    input.outerPearlRadiusMm
  )
    simpleError(
      "nucleus",
      "Offset nucleus must fit inside declared spherical pearl.",
    );
  return {
    minimumModelNacreThicknessMm:
      input.outerPearlRadiusMm -
      input.nucleusRadiusMm -
      input.nucleusCenterOffsetMm,
    maximumModelNacreThicknessMm:
      input.outerPearlRadiusMm -
      input.nucleusRadiusMm +
      input.nucleusCenterOffsetMm,
    sphericalShellVolumeMm3:
      ((4 * Math.PI) / 3) *
      (input.outerPearlRadiusMm - input.nucleusRadiusMm) *
      (input.outerPearlRadiusMm ** 2 +
        input.outerPearlRadiusMm * input.nucleusRadiusMm +
        input.nucleusRadiusMm ** 2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  outerPearlRadiusMm: 5,
  nucleusRadiusMm: 3,
  nucleusCenterOffsetMm: 1,
} satisfies Input;
export const exampleOutput = {
  minimumModelNacreThicknessMm: 1,
  maximumModelNacreThicknessMm: 3,
  sphericalShellVolumeMm3: 410.5014400690663,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/nacre-thickness-estimate",
  title: "Pearl Nacre Thickness Estimate",
  description:
    "Model minimum/maximum nacre thickness around eccentric spherical nucleus with exact nonoverlap shell volume; ideal measured geometry does not establish natural/cultured origin or actual uniform nacre quality.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumModelNacreThicknessMm",
      label: "Minimum model nacre thickness mm",
      kind: "number",
    },
    {
      id: "maximumModelNacreThicknessMm",
      label: "Maximum model nacre thickness mm",
      kind: "number",
    },
    {
      id: "sphericalShellVolumeMm3",
      label: "Spherical shell volume mm3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      outerPearlRadiusMm: value.outerPearlRadiusMm as number,
      nucleusRadiusMm: value.nucleusRadiusMm as number,
      nucleusCenterOffsetMm: value.nucleusCenterOffsetMm as number,
    }),
});
export const run = tool.execute;
export default tool;

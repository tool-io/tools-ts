import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly targetMz: number;
  readonly ppmTolerance: number;
}>;
export type Output = Readonly<{
  readonly lowerMz: number;
  readonly upperMz: number;
  readonly absoluteToleranceMz: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.targetMz <= 0 || input.ppmTolerance < 0)
    simpleError(
      "targetMz",
      "Positive target m/z and nonnegative ppm tolerance required.",
    );
  const absoluteToleranceMz = (input.targetMz * input.ppmTolerance) / 1e6;
  return {
    lowerMz: input.targetMz - absoluteToleranceMz,
    upperMz: input.targetMz + absoluteToleranceMz,
    absoluteToleranceMz,
  };
};
export const exampleInput = { targetMz: 500, ppmTolerance: 10 } satisfies Input;
export const exampleOutput = {
  lowerMz: 499.995,
  upperMz: 500.005,
  absoluteToleranceMz: 0.005,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/xic-mass-window",
  title: "XIC Mass Window",
  description:
    "Plan an extracted-ion m/z window from target mass and ppm tolerance.",
  inputs: [
    { id: "targetMz", kind: "number", label: "Target mz" },
    { id: "ppmTolerance", kind: "number", label: "Ppm tolerance" },
  ],
  outputs: [
    { id: "lowerMz", kind: "number", label: "Lower mz" },
    { id: "upperMz", kind: "number", label: "Upper mz" },
    {
      id: "absoluteToleranceMz",
      kind: "number",
      label: "Absolute tolerance mz",
    },
  ],
  calculate: (value) =>
    calculate({
      targetMz: value.targetMz as number,
      ppmTolerance: value.ppmTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bValue,
} from "../shared.js";
export type Input = Readonly<{
  readonly targetBSecondsPerSquareMm: number;
  readonly gammaHzPerTesla: number;
  readonly deltaMs: number;
  readonly separationMs: number;
}>;
export type Output = Readonly<{
  readonly gradientMilliTeslaPerMeter: number;
}>;
const inputFields = [
  {
    id: "targetBSecondsPerSquareMm",
    label: "Target b seconds per square mm",
    kind: "number",
    unit: "mm",
  },
  { id: "gammaHzPerTesla", label: "Gamma hz per tesla", kind: "number" },
  { id: "deltaMs", label: "Delta ms", kind: "number", unit: "ms" },
  { id: "separationMs", label: "Separation ms", kind: "number", unit: "ms" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.targetBSecondsPerSquareMm, "targetBSecondsPerSquareMm");
  const unitB = positive(
    bValue(input.gammaHzPerTesla, 1, input.deltaMs, input.separationMs),
    "model",
  );
  return {
    gradientMilliTeslaPerMeter: Math.sqrt(
      input.targetBSecondsPerSquareMm / unitB,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetBSecondsPerSquareMm: 1,
  gammaHzPerTesla: 1000000,
  deltaMs: 10,
  separationMs: 30,
} satisfies Input;
export const exampleOutput = {
  gradientMilliTeslaPerMeter: 97.46210015420952,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/pgse-gradient-from-target-b",
  title: "Diffusion Gradient Strength",
  description:
    "Invert ideal rectangular PGSE b for gradient magnitude at supplied timing; hardware capability, cross-terms and safety are not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "gradientMilliTeslaPerMeter",
      label: "Gradient milli tesla per meter",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      targetBSecondsPerSquareMm: value.targetBSecondsPerSquareMm as number,
      gammaHzPerTesla: value.gammaHzPerTesla as number,
      deltaMs: value.deltaMs as number,
      separationMs: value.separationMs as number,
    }),
});
export const run = tool.execute;
export default tool;

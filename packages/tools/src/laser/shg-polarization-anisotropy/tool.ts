import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly parallelIntensity: number;
  readonly perpendicularIntensity: number;
}>;
export type Output = Readonly<{
  readonly parallelToPerpendicularRatio: number;
  readonly anisotropy: number;
}>;

export const calculate = (input: Input): Output => {
  const denominator =
    input.parallelIntensity + 2 * input.perpendicularIntensity;
  if (input.perpendicularIntensity === 0 || denominator === 0)
    simpleError(
      "perpendicularIntensity",
      "Perpendicular intensity and anisotropy denominator must be positive.",
      "invalid_denominator",
    );
  return {
    parallelToPerpendicularRatio:
      input.parallelIntensity / input.perpendicularIntensity,
    anisotropy:
      (input.parallelIntensity - input.perpendicularIntensity) / denominator,
  };
};

export const exampleInput = {
  parallelIntensity: 4,
  perpendicularIntensity: 1,
} satisfies Input;
export const exampleOutput = {
  parallelToPerpendicularRatio: 4,
  anisotropy: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      parallelIntensity: input.parallelIntensity as number,
      perpendicularIntensity: input.perpendicularIntensity as number,
    }),
  description:
    "Calculate parallel/perpendicular SHG ratio and polarization anisotropy.",
  id: "laser/shg-polarization-anisotropy",
  inputs: [
    {
      id: "parallelIntensity",
      label: "Parallel SHG intensity",
      kind: "number",
      minimum: 0,
    },
    {
      id: "perpendicularIntensity",
      label: "Perpendicular SHG intensity",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "parallelToPerpendicularRatio",
      label: "Parallel-to-perpendicular ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "anisotropy",
      label: "SHG polarization anisotropy",
      kind: "number",
      minimum: -0.5,
      maximum: 1,
    },
  ],
  title: "SHG Polarization Anisotropy",
});

export const run = tool.execute;
export default tool;

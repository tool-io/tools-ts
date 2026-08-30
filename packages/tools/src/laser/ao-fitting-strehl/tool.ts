import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly actuatorPitchMeters: number;
  readonly friedParameterMeters: number;
}>;
export type Output = Readonly<{
  readonly fittingVarianceRad2: number;
  readonly estimatedStrehl: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.friedParameterMeters <= 0)
    simpleError(
      "friedParameterMeters",
      "Fried parameter must be positive.",
      "invalid_fried_parameter",
    );
  const fittingVarianceRad2 =
    0.28 * (input.actuatorPitchMeters / input.friedParameterMeters) ** (5 / 3);
  return {
    fittingVarianceRad2,
    estimatedStrehl: Math.exp(-fittingVarianceRad2),
  };
};

export const exampleInput = {
  actuatorPitchMeters: 1,
  friedParameterMeters: 1,
} satisfies Input;
export const exampleOutput = {
  fittingVarianceRad2: 0.28,
  estimatedStrehl: 0.7557837414557255,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      actuatorPitchMeters: input.actuatorPitchMeters as number,
      friedParameterMeters: input.friedParameterMeters as number,
    }),
  description:
    "Estimate adaptive-optics fitting variance and Strehl from actuator pitch.",
  id: "laser/ao-fitting-strehl",
  inputs: [
    {
      id: "actuatorPitchMeters",
      label: "Actuator pitch",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "friedParameterMeters",
      label: "Fried parameter",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "fittingVarianceRad2",
      label: "AO fitting-error variance",
      kind: "number",
      minimum: 0,
      unit: "rad²",
    },
    {
      id: "estimatedStrehl",
      label: "Marechal Strehl estimate",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  title: "AO Fitting Strehl",
});

export const run = tool.execute;
export default tool;

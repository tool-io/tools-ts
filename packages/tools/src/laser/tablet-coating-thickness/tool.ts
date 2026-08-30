import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly roundTripDelaySeconds: number;
  readonly refractiveIndex: number;
}>;
export type Output = Readonly<{
  readonly coatingThicknessMeters: number;
  readonly coatingThicknessMicrometers: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.refractiveIndex <= 0)
    simpleError(
      "refractiveIndex",
      "Refractive index must be positive.",
      "invalid_index",
    );
  const coatingThicknessMeters =
    (299792458 * input.roundTripDelaySeconds) / (2 * input.refractiveIndex);
  return {
    coatingThicknessMeters,
    coatingThicknessMicrometers: coatingThicknessMeters * 1e6,
  };
};

export const exampleInput = {
  roundTripDelaySeconds: 1e-11,
  refractiveIndex: 1.5,
} satisfies Input;
export const exampleOutput = {
  coatingThicknessMeters: 0.0009993081933333333,
  coatingThicknessMicrometers: 999.3081933333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      roundTripDelaySeconds: input.roundTripDelaySeconds as number,
      refractiveIndex: input.refractiveIndex as number,
    }),
  description: "Convert THz round-trip delay into tablet-coating thickness.",
  id: "laser/tablet-coating-thickness",
  inputs: [
    {
      id: "roundTripDelaySeconds",
      label: "Coating round-trip delay",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "refractiveIndex",
      label: "Coating refractive index",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "coatingThicknessMeters",
      label: "Coating thickness",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "coatingThicknessMicrometers",
      label: "Coating thickness",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
  ],
  title: "Tablet-Coating Thickness",
});

export const run = tool.execute;
export default tool;

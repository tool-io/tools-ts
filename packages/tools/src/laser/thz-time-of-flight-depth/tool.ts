import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly roundTripDelaySeconds: number;
  readonly refractiveIndex: number;
}>;
export type Output = Readonly<{
  readonly layerDepthMeters: number;
  readonly layerDepthMillimeters: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.refractiveIndex <= 0)
    simpleError(
      "refractiveIndex",
      "Refractive index must be positive.",
      "invalid_index",
    );
  const layerDepthMeters =
    (299792458 * input.roundTripDelaySeconds) / (2 * input.refractiveIndex);
  return { layerDepthMeters, layerDepthMillimeters: layerDepthMeters * 1000 };
};

export const exampleInput = {
  roundTripDelaySeconds: 2e-11,
  refractiveIndex: 2,
} satisfies Input;
export const exampleOutput = {
  layerDepthMeters: 0.0014989622899999999,
  layerDepthMillimeters: 1.49896229,
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
  description: "Convert a THz reflection delay into subsurface layer depth.",
  id: "laser/thz-time-of-flight-depth",
  inputs: [
    {
      id: "roundTripDelaySeconds",
      label: "Layer round-trip delay",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "refractiveIndex",
      label: "Layer refractive index",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "layerDepthMeters",
      label: "Layer depth",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "layerDepthMillimeters",
      label: "Layer depth",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
  ],
  title: "THz Time-of-Flight Depth",
});

export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly radialSpotDiameterMicrometers: number;
  readonly linearSpotDiameterMicrometers: number;
}>;
export type Output = Readonly<{
  readonly diameterRatio: number;
  readonly areaReductionPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.linearSpotDiameterMicrometers <= 0)
    simpleError(
      "linearSpotDiameterMicrometers",
      "Linear spot diameter must be positive.",
      "invalid_baseline",
    );
  const diameterRatio =
    input.radialSpotDiameterMicrometers / input.linearSpotDiameterMicrometers;
  return {
    diameterRatio,
    areaReductionPercent: (1 - diameterRatio ** 2) * 100,
  };
};

export const exampleInput = {
  radialSpotDiameterMicrometers: 0.4,
  linearSpotDiameterMicrometers: 0.5,
} satisfies Input;
export const exampleOutput = {
  diameterRatio: 0.8,
  areaReductionPercent: 35.999999999999986,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      radialSpotDiameterMicrometers:
        input.radialSpotDiameterMicrometers as number,
      linearSpotDiameterMicrometers:
        input.linearSpotDiameterMicrometers as number,
    }),
  description:
    "Compare radial- and linear-polarization focal spot diameters and areas.",
  id: "laser/radial-polarization-spot-comparison",
  inputs: [
    {
      id: "radialSpotDiameterMicrometers",
      label: "Radially polarized spot diameter",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
    {
      id: "linearSpotDiameterMicrometers",
      label: "Linearly polarized spot diameter",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
  ],
  outputs: [
    {
      id: "diameterRatio",
      label: "Radial-to-linear diameter ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "areaReductionPercent",
      label: "Spot-area reduction",
      kind: "number",
      unit: "%",
    },
  ],
  title: "Radial-Polarization Spot Comparison",
});

export const run = tool.execute;
export default tool;

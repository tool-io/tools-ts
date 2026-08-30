import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly diffractionLimitedResolutionNanometers: number;
  readonly depletionIntensityWPerM2: number;
  readonly saturationIntensityWPerM2: number;
}>;
export type Output = Readonly<{
  readonly stedResolutionNanometers: number;
  readonly resolutionImprovementFactor: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.saturationIntensityWPerM2 <= 0)
    simpleError(
      "saturationIntensityWPerM2",
      "Saturation intensity must be positive.",
      "invalid_saturation",
    );
  const resolutionImprovementFactor = Math.sqrt(
    1 + input.depletionIntensityWPerM2 / input.saturationIntensityWPerM2,
  );
  return {
    stedResolutionNanometers:
      input.diffractionLimitedResolutionNanometers /
      resolutionImprovementFactor,
    resolutionImprovementFactor,
  };
};

export const exampleInput = {
  diffractionLimitedResolutionNanometers: 200,
  depletionIntensityWPerM2: 3,
  saturationIntensityWPerM2: 1,
} satisfies Input;
export const exampleOutput = {
  stedResolutionNanometers: 100,
  resolutionImprovementFactor: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      diffractionLimitedResolutionNanometers:
        input.diffractionLimitedResolutionNanometers as number,
      depletionIntensityWPerM2: input.depletionIntensityWPerM2 as number,
      saturationIntensityWPerM2: input.saturationIntensityWPerM2 as number,
    }),
  description:
    "Estimate idealized STED resolution from depletion and saturation intensities.",
  id: "laser/sted-resolution",
  inputs: [
    {
      id: "diffractionLimitedResolutionNanometers",
      label: "Un-depleted resolution",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "depletionIntensityWPerM2",
      label: "STED depletion intensity",
      kind: "number",
      minimum: 0,
      unit: "W/m²",
    },
    {
      id: "saturationIntensityWPerM2",
      label: "Saturation intensity",
      kind: "number",
      minimum: 0,
      unit: "W/m²",
    },
  ],
  outputs: [
    {
      id: "stedResolutionNanometers",
      label: "Estimated STED resolution",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "resolutionImprovementFactor",
      label: "Resolution improvement factor",
      kind: "number",
      minimum: 1,
    },
  ],
  title: "STED Resolution",
});

export const run = tool.execute;
export default tool;

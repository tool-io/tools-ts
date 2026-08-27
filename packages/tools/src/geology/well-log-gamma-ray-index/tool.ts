import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WellLogGammaRayIndexInput = {
  readonly gammaRayApi: number;
  readonly gammaRayCleanApi: number;
  readonly gammaRayShaleApi: number;
};

export type WellLogGammaRayIndexOutput = {
  readonly gammaRayIndex: number;
};

export const calculateWellLogGammaRayIndex = (
  input: WellLogGammaRayIndexInput,
): WellLogGammaRayIndexOutput => {
  if (!(input.gammaRayShaleApi > input.gammaRayCleanApi))
    return simpleError(
      "gammaRayShaleApi",
      "The shale-line reading must exceed the clean-line reading.",
      "invalid_gr",
    );
  return {
    gammaRayIndex:
      (input.gammaRayApi - input.gammaRayCleanApi) /
      (input.gammaRayShaleApi - input.gammaRayCleanApi),
  };
};

export const wellLogGammaRayIndexExample = {
  input: { gammaRayApi: 90, gammaRayCleanApi: 20, gammaRayShaleApi: 120 },
  output: { gammaRayIndex: 0.7 },
} satisfies ToolExample<WellLogGammaRayIndexInput, WellLogGammaRayIndexOutput>;

export const wellLogGammaRayIndexTool = createSimpleTool({
  id: "geology/well-log-gamma-ray-index",
  title: "Well Log Gamma Ray Index Calculator",
  description:
    "Linear gamma-ray index IGR = (GR - GR_clean) / (GR_shale - GR_clean) from log readings in API units; the standard first step toward Larionov-style Vshale estimates.",
  inputs: [
    {
      description:
        "Gamma-ray log reading at the depth of interest in API units.",
      id: "gammaRayApi",
      kind: "number",
      label: "GR",
    },
    {
      description: "Clean (zero-shale) baseline reading in API units.",
      id: "gammaRayCleanApi",
      kind: "number",
      label: "GR clean",
    },
    {
      description: "Shale-point reading in API units.",
      id: "gammaRayShaleApi",
      kind: "number",
      label: "GR shale",
    },
  ],
  outputs: [
    {
      description: "Gamma-ray index between the clean and shale end members.",
      id: "gammaRayIndex",
      kind: "number",
      label: "IGR",
    },
  ],
  calculate: (input) =>
    calculateWellLogGammaRayIndex(
      input as unknown as WellLogGammaRayIndexInput,
    ),
});

export const runWellLogGammaRayIndex = wellLogGammaRayIndexTool.execute;
export default wellLogGammaRayIndexTool;

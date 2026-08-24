import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhotodiodeDarkCurrentInput = {
  readonly activeAreaCm2: number;
  readonly darkCurrentDensityNAPerCm2: number;
};

export type PhotodiodeDarkCurrentOutput = {
  readonly darkCurrentNA: number;
};

export const photodiodeDarkCurrentExample = {
  input: {
    activeAreaCm2: 0.01,
    darkCurrentDensityNAPerCm2: 10,
  },
  output: { darkCurrentNA: 0.1 },
} satisfies ToolExample<
  PhotodiodeDarkCurrentInput,
  PhotodiodeDarkCurrentOutput
>;

export const photodiodeDarkCurrentTool = createSimpleTool({
  id: "semiconductor/photodiode-dark-current",
  title: "Dark Current Calculator",
  description:
    "Compute photodiode dark current from dark current density and active area.",
  inputs: [
    {
      description: "Dark current per unit area.",
      id: "darkCurrentDensityNAPerCm2",
      kind: "number",
      label: "Dark current density",
      minimum: 0,
      unit: "nA/cm²",
    },
    {
      description: "Light-sensitive device area.",
      id: "activeAreaCm2",
      kind: "number",
      label: "Active area",
      minimum: Number.MIN_VALUE,
      unit: "cm²",
    },
  ],
  outputs: [
    {
      description: "Total reverse-bias leakage current.",
      format: "current",
      id: "darkCurrentNA",
      kind: "number",
      label: "Dark current",
      minimum: 0,
      unit: "nA",
    },
  ],
  calculate: (input) => {
    const activeArea = input.activeAreaCm2 as number;
    if (!(activeArea > 0))
      simpleError(
        "activeAreaCm2",
        "Active area must be positive.",
        "invalid_area",
      );
    return {
      darkCurrentNA: (input.darkCurrentDensityNAPerCm2 as number) * activeArea,
    };
  },
});
export const runPhotodiodeDarkCurrent = photodiodeDarkCurrentTool.execute;
export default photodiodeDarkCurrentTool;

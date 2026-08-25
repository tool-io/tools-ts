import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SporeSizeLwRatioMeasurerInput = {
  readonly lengthUm: number;
  readonly widthUm: number;
};

export type SporeSizeLwRatioMeasurerOutput = {
  readonly lengthWidthRatio: number;
};

export const sporeSizeLwRatioMeasurerExample = {
  input: { lengthUm: 12, widthUm: 6 },
  output: { lengthWidthRatio: 2 },
} satisfies ToolExample<
  SporeSizeLwRatioMeasurerInput,
  SporeSizeLwRatioMeasurerOutput
>;

export const sporeSizeLwRatioMeasurerTool = createSimpleTool({
  id: "mycology/spore-size-lw-ratio-measurer",
  title: "Spore L/W Ratio",
  description:
    "Compute the length-to-width ratio of a spore from micrometer measurements.",
  inputs: [
    { id: "lengthUm", label: "Spore length", kind: "number", unit: "µm" },
    { id: "widthUm", label: "Spore width", kind: "number", unit: "µm" },
  ],
  outputs: [{ id: "lengthWidthRatio", label: "L/W ratio", kind: "number" }],
  calculate: (input) => {
    const lengthUm = input.lengthUm as number;
    const widthUm = input.widthUm as number;
    if (!(lengthUm > 0))
      simpleError("lengthUm", "Spore length must be positive.");
    if (!(widthUm > 0)) simpleError("widthUm", "Spore width must be positive.");
    const lengthWidthRatio = lengthUm / widthUm;
    if (!Number.isFinite(lengthWidthRatio))
      simpleError(
        "lengthUm",
        "The length-to-width ratio is too large to represent.",
      );
    return { lengthWidthRatio };
  },
});
export const runSporeSizeLwRatioMeasurer = sporeSizeLwRatioMeasurerTool.execute;
export default sporeSizeLwRatioMeasurerTool;

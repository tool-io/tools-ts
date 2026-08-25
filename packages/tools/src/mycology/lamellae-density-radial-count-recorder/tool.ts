import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type LamellaeDensityRadialCountRecorderInput = {
  readonly gillsCountedInt: number;
};

export type LamellaeDensityRadialCountRecorderOutput = {
  readonly lamellaeCount: number;
};

export const lamellaeDensityRadialCountRecorderExample = {
  input: { gillsCountedInt: 60 },
  output: { lamellaeCount: 60 },
} satisfies ToolExample<
  LamellaeDensityRadialCountRecorderInput,
  LamellaeDensityRadialCountRecorderOutput
>;

export const lamellaeDensityRadialCountRecorderTool = createSimpleTool({
  id: "mycology/lamellae-density-radial-count-recorder",
  title: "Lamellae Density Recorder",
  description:
    "Validate and record a radial lamella count without applying cap-size-independent density categories.",
  inputs: [
    {
      id: "gillsCountedInt",
      kind: "integer",
      label: "Gills counted",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "lamellaeCount",
      kind: "integer",
      label: "Lamellae count",
      minimum: 0,
    },
  ],
  calculate: (input) => {
    const { gillsCountedInt } =
      input as unknown as LamellaeDensityRadialCountRecorderInput;
    return { lamellaeCount: gillsCountedInt };
  },
});
export const runLamellaeDensityRadialCountRecorder =
  lamellaeDensityRadialCountRecorderTool.execute;
export default lamellaeDensityRadialCountRecorderTool;

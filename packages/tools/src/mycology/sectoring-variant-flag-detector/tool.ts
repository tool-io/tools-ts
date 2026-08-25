import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SectoringVariantFlagDetectorInput = {
  readonly sectorCount: number;
};

export type SectoringVariantFlagDetectorOutput = {
  readonly sectorCount: number;
  readonly sectoringDetected: boolean;
};

export const sectoringVariantFlagDetectorExample = {
  input: { sectorCount: 3 },
  output: { sectorCount: 3, sectoringDetected: true },
} satisfies ToolExample<
  SectoringVariantFlagDetectorInput,
  SectoringVariantFlagDetectorOutput
>;

export const sectoringVariantFlagDetectorTool = createSimpleTool({
  id: "mycology/sectoring-variant-flag-detector",
  title: "Sectoring Flag Detector",
  description:
    "Flag culture sectoring when one or more distinct sectors are counted on a plate.",
  inputs: [
    {
      id: "sectorCount",
      kind: "integer",
      label: "Sector count",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "sectoringDetected", label: "Sectoring detected", kind: "boolean" },
    { id: "sectorCount", label: "Sector count", kind: "integer" },
  ],
  calculate: (input) => ({
    sectorCount: input.sectorCount as number,
    sectoringDetected: (input.sectorCount as number) > 0,
  }),
});
export const runSectoringVariantFlagDetector =
  sectoringVariantFlagDetectorTool.execute;
export default sectoringVariantFlagDetectorTool;

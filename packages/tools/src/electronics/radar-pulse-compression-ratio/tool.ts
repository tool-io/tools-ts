import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RadarPulseCompressionRatioInput = Readonly<{
  readonly pulseSeconds: number;
  readonly bandwidthHertz: number;
}>;
export type RadarPulseCompressionRatioOutput = Readonly<{
  readonly compressionRatio: number;
}>;

export const calculateRadarPulseCompressionRatio = (
  x: RadarPulseCompressionRatioInput,
): RadarPulseCompressionRatioOutput => {
  if (!Number.isFinite(x.pulseSeconds) || x.pulseSeconds < 0)
    simpleError("pulseSeconds", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.bandwidthHertz) || x.bandwidthHertz < 0)
    simpleError("bandwidthHertz", "Provide a finite number at least 0.");
  const compressionRatio = x.pulseSeconds * x.bandwidthHertz;
  if (!Number.isFinite(compressionRatio))
    simpleError(
      "compressionRatio",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    compressionRatio: Object.is(compressionRatio, -0) ? 0 : compressionRatio,
  };
};

export const example = {
  input: { pulseSeconds: 0.0001, bandwidthHertz: 10000000 },
  output: { compressionRatio: 1000 },
} satisfies ToolExample<
  RadarPulseCompressionRatioInput,
  RadarPulseCompressionRatioOutput
>;

export const tool = createSimpleTool({
  id: "electronics/radar-pulse-compression-ratio",
  title: "Radar Pulse Compression Ratio",
  description:
    "Ideal matched-filter pulse-compression ratio equal to transmitted pulse duration times swept bandwidth.",
  inputs: [
    {
      id: "pulseSeconds",
      kind: "number",
      label: "Pulse Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "bandwidthHertz",
      kind: "number",
      label: "Bandwidth Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "compressionRatio", kind: "number", label: "Compression Ratio" },
  ],
  calculate: (input) =>
    calculateRadarPulseCompressionRatio({
      pulseSeconds: input.pulseSeconds as number,
      bandwidthHertz: input.bandwidthHertz as number,
    }),
});
export const radarPulseCompressionRatioTool = tool;
export const runRadarPulseCompressionRatio = tool.execute;
export default tool;

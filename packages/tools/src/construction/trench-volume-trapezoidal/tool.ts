import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrenchVolumeTrapezoidalInput = Readonly<{
  readonly topWidthM: number;
  readonly bottomWidthM: number;
  readonly depthM: number;
  readonly lengthM: number;
}>;
export type TrenchVolumeTrapezoidalOutput = Readonly<{
  readonly volumeM3: number;
}>;

export const calculateTrenchVolumeTrapezoidal = (
  x: TrenchVolumeTrapezoidalInput,
): TrenchVolumeTrapezoidalOutput => {
  if (!Number.isFinite(x.topWidthM) || x.topWidthM < 0)
    simpleError("topWidthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.bottomWidthM) || x.bottomWidthM < 0)
    simpleError("bottomWidthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.depthM) || x.depthM < 0)
    simpleError("depthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lengthM) || x.lengthM < 0)
    simpleError("lengthM", "Provide a finite number at least 0.");
  if (!(x.topWidthM >= x.bottomWidthM))
    simpleError("topWidthM", "Top width must be at least bottom width.");
  const volumeM3 = ((x.topWidthM + x.bottomWidthM) * x.depthM * x.lengthM) / 2;
  if (!Number.isFinite(volumeM3))
    simpleError("volumeM3", "The inputs produce an invalid result.");
  return { volumeM3: Object.is(volumeM3, -0) ? 0 : volumeM3 };
};

export const example = {
  input: { topWidthM: 2, bottomWidthM: 1, depthM: 1, lengthM: 10 },
  output: { volumeM3: 15 },
} satisfies ToolExample<
  TrenchVolumeTrapezoidalInput,
  TrenchVolumeTrapezoidalOutput
>;

export const tool = createSimpleTool({
  id: "construction/trench-volume-trapezoidal",
  title: "Trapezoidal Trench Volume",
  description:
    "Calculate straight trench volume with a constant trapezoidal cross-section from top width, bottom width, depth, and length.",
  inputs: [
    {
      id: "topWidthM",
      kind: "number",
      label: "Top width",
      unit: "m",
      minimum: 0,
    },
    {
      id: "bottomWidthM",
      kind: "number",
      label: "Bottom width",
      unit: "m",
      minimum: 0,
    },
    { id: "depthM", kind: "number", label: "Depth", unit: "m", minimum: 0 },
    {
      id: "lengthM",
      kind: "number",
      label: "Trench length",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "volumeM3", kind: "number", label: "Trench volume", unit: "m³" },
  ],
  calculate: (input) =>
    calculateTrenchVolumeTrapezoidal({
      topWidthM: input.topWidthM as number,
      bottomWidthM: input.bottomWidthM as number,
      depthM: input.depthM as number,
      lengthM: input.lengthM as number,
    }),
});
export const trenchVolumeTrapezoidalTool = tool;
export const runTrenchVolumeTrapezoidal = tool.execute;
export default tool;

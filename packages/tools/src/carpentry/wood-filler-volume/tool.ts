import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WoodFillerVolumeInput = Readonly<{
  readonly cavityLengthMm: number;
  readonly cavityWidthMm: number;
  readonly cavityDepthMm: number;
}>;
export type WoodFillerVolumeOutput = Readonly<{
  readonly fillerVolumeLiters: number;
}>;

export const calculateWoodFillerVolume = (
  x: WoodFillerVolumeInput,
): WoodFillerVolumeOutput => {
  if (!Number.isFinite(x.cavityLengthMm) || x.cavityLengthMm < 0)
    simpleError("cavityLengthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.cavityWidthMm) || x.cavityWidthMm < 0)
    simpleError("cavityWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.cavityDepthMm) || x.cavityDepthMm < 0)
    simpleError("cavityDepthMm", "Provide a finite number at least 0.");
  const fillerVolumeLiters =
    (x.cavityLengthMm * x.cavityWidthMm * x.cavityDepthMm) / 1e6;
  if (!Number.isFinite(fillerVolumeLiters))
    simpleError("fillerVolumeLiters", "The inputs produce an invalid result.");
  return {
    fillerVolumeLiters: Object.is(fillerVolumeLiters, -0)
      ? 0
      : fillerVolumeLiters,
  };
};

export const example = {
  input: { cavityLengthMm: 100, cavityWidthMm: 10, cavityDepthMm: 5 },
  output: { fillerVolumeLiters: 0.005 },
} satisfies ToolExample<WoodFillerVolumeInput, WoodFillerVolumeOutput>;

export const tool = createSimpleTool({
  id: "carpentry/wood-filler-volume",
  title: "Wood Filler Volume",
  description:
    "Estimate filler volume for one approximately rectangular cavity from its measured length, width, and depth.",
  inputs: [
    {
      id: "cavityLengthMm",
      kind: "number",
      label: "Cavity length",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "cavityWidthMm",
      kind: "number",
      label: "Cavity width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "cavityDepthMm",
      kind: "number",
      label: "Cavity depth",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "fillerVolumeLiters",
      kind: "number",
      label: "Geometric filler volume",
      unit: "L",
    },
  ],
  calculate: (input) =>
    calculateWoodFillerVolume({
      cavityLengthMm: input.cavityLengthMm as number,
      cavityWidthMm: input.cavityWidthMm as number,
      cavityDepthMm: input.cavityDepthMm as number,
    }),
});
export const woodFillerVolumeTool = tool;
export const runWoodFillerVolume = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExcavationRectangularVolumeInput = Readonly<{
  readonly lengthM: number;
  readonly widthM: number;
  readonly depthM: number;
}>;
export type ExcavationRectangularVolumeOutput = Readonly<{
  readonly volumeM3: number;
}>;

export const calculateExcavationRectangularVolume = (
  x: ExcavationRectangularVolumeInput,
): ExcavationRectangularVolumeOutput => {
  if (!Number.isFinite(x.lengthM) || x.lengthM < 0)
    simpleError("lengthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.widthM) || x.widthM < 0)
    simpleError("widthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.depthM) || x.depthM < 0)
    simpleError("depthM", "Provide a finite number at least 0.");
  const volumeM3 = x.lengthM * x.widthM * x.depthM;
  if (!Number.isFinite(volumeM3))
    simpleError("volumeM3", "The inputs produce an invalid result.");
  return { volumeM3: Object.is(volumeM3, -0) ? 0 : volumeM3 };
};

export const example = {
  input: { lengthM: 10, widthM: 2, depthM: 1 },
  output: { volumeM3: 20 },
} satisfies ToolExample<
  ExcavationRectangularVolumeInput,
  ExcavationRectangularVolumeOutput
>;

export const tool = createSimpleTool({
  id: "construction/excavation-rectangular-volume",
  title: "Rectangular Excavation Volume",
  description:
    "Calculate in-place volume of a rectangular excavation from measured length, width, and depth.",
  inputs: [
    {
      id: "lengthM",
      kind: "number",
      label: "Excavation length",
      unit: "m",
      minimum: 0,
    },
    {
      id: "widthM",
      kind: "number",
      label: "Excavation width",
      unit: "m",
      minimum: 0,
    },
    {
      id: "depthM",
      kind: "number",
      label: "Excavation depth",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "volumeM3", kind: "number", label: "Excavation volume", unit: "m³" },
  ],
  calculate: (input) =>
    calculateExcavationRectangularVolume({
      lengthM: input.lengthM as number,
      widthM: input.widthM as number,
      depthM: input.depthM as number,
    }),
});
export const excavationRectangularVolumeTool = tool;
export const runExcavationRectangularVolume = tool.execute;
export default tool;

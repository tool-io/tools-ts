import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CutFillNetVolumeInput = Readonly<{
  readonly fillVolumeM3: number;
  readonly cutVolumeM3: number;
}>;
export type CutFillNetVolumeOutput = Readonly<{
  readonly netFillM3: number;
}>;

export const calculateCutFillNetVolume = (
  x: CutFillNetVolumeInput,
): CutFillNetVolumeOutput => {
  if (!Number.isFinite(x.fillVolumeM3) || x.fillVolumeM3 < 0)
    simpleError("fillVolumeM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.cutVolumeM3) || x.cutVolumeM3 < 0)
    simpleError("cutVolumeM3", "Provide a finite number at least 0.");
  const netFillM3 = x.fillVolumeM3 - x.cutVolumeM3;
  if (!Number.isFinite(netFillM3))
    simpleError("netFillM3", "The inputs produce an invalid result.");
  return { netFillM3: Object.is(netFillM3, -0) ? 0 : netFillM3 };
};

export const example = {
  input: { fillVolumeM3: 20, cutVolumeM3: 12 },
  output: { netFillM3: 8 },
} satisfies ToolExample<CutFillNetVolumeInput, CutFillNetVolumeOutput>;

export const tool = createSimpleTool({
  id: "construction/cut-fill-net-volume",
  title: "Cut Fill Net Volume",
  description:
    "Subtract measured cut volume from measured fill volume; positive results mean imported fill is needed.",
  inputs: [
    {
      id: "fillVolumeM3",
      kind: "number",
      label: "Required fill volume",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "cutVolumeM3",
      kind: "number",
      label: "Available cut volume",
      unit: "m³",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "netFillM3",
      kind: "number",
      label: "Net fill (+) or surplus cut (-)",
      unit: "m³",
    },
  ],
  calculate: (input) =>
    calculateCutFillNetVolume({
      fillVolumeM3: input.fillVolumeM3 as number,
      cutVolumeM3: input.cutVolumeM3 as number,
    }),
});
export const cutFillNetVolumeTool = tool;
export const runCutFillNetVolume = tool.execute;
export default tool;

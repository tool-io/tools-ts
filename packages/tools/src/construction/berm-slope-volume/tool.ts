import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BermSlopeVolumeInput = Readonly<{
  readonly topWidthM: number;
  readonly baseWidthM: number;
  readonly heightM: number;
  readonly lengthM: number;
}>;
export type BermSlopeVolumeOutput = Readonly<{
  readonly bermVolumeM3: number;
}>;

export const calculateBermSlopeVolume = (
  x: BermSlopeVolumeInput,
): BermSlopeVolumeOutput => {
  if (!Number.isFinite(x.topWidthM) || x.topWidthM < 0)
    simpleError("topWidthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.baseWidthM) || x.baseWidthM < 0)
    simpleError("baseWidthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.heightM) || x.heightM < 0)
    simpleError("heightM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lengthM) || x.lengthM < 0)
    simpleError("lengthM", "Provide a finite number at least 0.");
  if (!(x.baseWidthM >= x.topWidthM))
    simpleError("baseWidthM", "Base width must be at least top width.");
  const bermVolumeM3 =
    ((x.topWidthM + x.baseWidthM) * x.heightM * x.lengthM) / 2;
  if (!Number.isFinite(bermVolumeM3))
    simpleError("bermVolumeM3", "The inputs produce an invalid result.");
  return { bermVolumeM3: Object.is(bermVolumeM3, -0) ? 0 : bermVolumeM3 };
};

export const example = {
  input: { topWidthM: 1, baseWidthM: 3, heightM: 1, lengthM: 10 },
  output: { bermVolumeM3: 20 },
} satisfies ToolExample<BermSlopeVolumeInput, BermSlopeVolumeOutput>;

export const tool = createSimpleTool({
  id: "construction/berm-slope-volume",
  title: "Berm Slope Volume",
  description:
    "Calculate straight berm volume with a trapezoidal cross-section and constant top and base widths.",
  inputs: [
    {
      id: "topWidthM",
      kind: "number",
      label: "Berm crest width",
      unit: "m",
      minimum: 0,
    },
    {
      id: "baseWidthM",
      kind: "number",
      label: "Berm base width",
      unit: "m",
      minimum: 0,
    },
    {
      id: "heightM",
      kind: "number",
      label: "Berm height",
      unit: "m",
      minimum: 0,
    },
    {
      id: "lengthM",
      kind: "number",
      label: "Berm length",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "bermVolumeM3", kind: "number", label: "Berm volume", unit: "m³" },
  ],
  calculate: (input) =>
    calculateBermSlopeVolume({
      topWidthM: input.topWidthM as number,
      baseWidthM: input.baseWidthM as number,
      heightM: input.heightM as number,
      lengthM: input.lengthM as number,
    }),
});
export const bermSlopeVolumeTool = tool;
export const runBermSlopeVolume = tool.execute;
export default tool;

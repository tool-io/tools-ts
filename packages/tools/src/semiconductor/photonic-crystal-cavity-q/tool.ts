import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhotonicCrystalCavityQInput = Readonly<{
  readonly resonanceHertz: number;
  readonly linewidthHertz: number;
}>;
export type PhotonicCrystalCavityQOutput = Readonly<{
  readonly loadedQualityFactor: number;
}>;

export const calculatePhotonicCrystalCavityQ = (
  x: PhotonicCrystalCavityQInput,
): PhotonicCrystalCavityQOutput => {
  if (!Number.isFinite(x.resonanceHertz) || x.resonanceHertz < 0)
    simpleError("resonanceHertz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.linewidthHertz) || x.linewidthHertz < 0)
    simpleError("linewidthHertz", "Provide a finite number at least 0.");
  const loadedQualityFactor = x.resonanceHertz / x.linewidthHertz;
  if (!Number.isFinite(loadedQualityFactor))
    simpleError(
      "loadedQualityFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    loadedQualityFactor: Object.is(loadedQualityFactor, -0)
      ? 0
      : loadedQualityFactor,
  };
};

export const example = {
  input: { resonanceHertz: 200000000000000, linewidthHertz: 2000000000 },
  output: { loadedQualityFactor: 100000 },
} satisfies ToolExample<
  PhotonicCrystalCavityQInput,
  PhotonicCrystalCavityQOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/photonic-crystal-cavity-q",
  title: "Photonic Crystal Cavity Q",
  description:
    "Loaded photonic-crystal cavity quality factor from measured resonance frequency and full-width-at-half-maximum linewidth.",
  inputs: [
    {
      id: "resonanceHertz",
      kind: "number",
      label: "Resonance Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "linewidthHertz",
      kind: "number",
      label: "Linewidth Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "loadedQualityFactor",
      kind: "number",
      label: "Loaded Quality Factor",
    },
  ],
  calculate: (input) =>
    calculatePhotonicCrystalCavityQ({
      resonanceHertz: input.resonanceHertz as number,
      linewidthHertz: input.linewidthHertz as number,
    }),
});
export const photonicCrystalCavityQTool = tool;
export const runPhotonicCrystalCavityQ = tool.execute;
export default tool;

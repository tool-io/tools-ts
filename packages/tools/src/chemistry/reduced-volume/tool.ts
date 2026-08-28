import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const ReducedVolumeTool = createSimpleTool({
  id: "chemistry/reduced-volume",
  title: "Reduced Volume Calculator",
  description: "Compute reduced volume Vr = V/Vc.",
  inputs: [
    { id: "volumeL", label: "Volume", kind: "number", minimum: 0, unit: "L" },
    {
      id: "criticalVolumeLMol",
      label: "Vc",
      kind: "number",
      minimum: 0,
      unit: "L/mol",
    },
  ],
  outputs: [{ id: "reducedVolume", label: "Vr", kind: "number" }],
  calculate: (input) => {
    const vc = input.criticalVolumeLMol as number;
    if (vc <= 0)
      simpleError("criticalVolumeLMol", ">0 required.", "invalid_vc");
    return { reducedVolume: (input.volumeL as number) / vc };
  },
});
export default ReducedVolumeTool;
export const runReducedVolume = ReducedVolumeTool.execute;

export type ReducedVolumeInput = {
  readonly volumeL: number;
  readonly criticalVolumeLMol: number;
};

export type ReducedVolumeOutput = {
  readonly reducedVolume: number;
};

export const reducedVolumeExample = {
  input: {
    volumeL: 1,
    criticalVolumeLMol: 1,
  },
  output: {
    reducedVolume: 1,
  },
} satisfies ToolExample<ReducedVolumeInput, ReducedVolumeOutput>;

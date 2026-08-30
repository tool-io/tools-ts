import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RepointingMortarVolumeInput = Readonly<{
  readonly jointLengthM: number;
  readonly jointWidthMm: number;
  readonly rakedDepthMm: number;
}>;
export type RepointingMortarVolumeOutput = Readonly<{
  readonly mortarVolumeLiters: number;
}>;

export const calculateRepointingMortarVolume = (
  x: RepointingMortarVolumeInput,
): RepointingMortarVolumeOutput => {
  if (!Number.isFinite(x.jointLengthM) || x.jointLengthM < 0)
    simpleError("jointLengthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.jointWidthMm) || x.jointWidthMm < 0)
    simpleError("jointWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.rakedDepthMm) || x.rakedDepthMm < 0)
    simpleError("rakedDepthMm", "Provide a finite number at least 0.");
  const mortarVolumeLiters =
    (x.jointLengthM * x.jointWidthMm * x.rakedDepthMm) / 1000;
  if (!Number.isFinite(mortarVolumeLiters))
    simpleError("mortarVolumeLiters", "The inputs produce an invalid result.");
  return {
    mortarVolumeLiters: Object.is(mortarVolumeLiters, -0)
      ? 0
      : mortarVolumeLiters,
  };
};

export const example = {
  input: { jointLengthM: 20, jointWidthMm: 10, rakedDepthMm: 20 },
  output: { mortarVolumeLiters: 4 },
} satisfies ToolExample<
  RepointingMortarVolumeInput,
  RepointingMortarVolumeOutput
>;

export const tool = createSimpleTool({
  id: "construction/repointing-mortar-volume",
  title: "Repointing Mortar Volume",
  description:
    "Estimate fresh mortar for repointing from total prepared joint length, average width, and raked depth.",
  inputs: [
    {
      id: "jointLengthM",
      kind: "number",
      label: "Prepared joint length",
      unit: "m",
      minimum: 0,
    },
    {
      id: "jointWidthMm",
      kind: "number",
      label: "Joint width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "rakedDepthMm",
      kind: "number",
      label: "Raked depth",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "mortarVolumeLiters",
      kind: "number",
      label: "Fresh mortar volume",
      unit: "L",
    },
  ],
  calculate: (input) =>
    calculateRepointingMortarVolume({
      jointLengthM: input.jointLengthM as number,
      jointWidthMm: input.jointWidthMm as number,
      rakedDepthMm: input.rakedDepthMm as number,
    }),
});
export const repointingMortarVolumeTool = tool;
export const runRepointingMortarVolume = tool.execute;
export default tool;

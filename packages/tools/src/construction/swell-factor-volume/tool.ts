import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SwellFactorVolumeInput = Readonly<{
  readonly bankVolumeM3: number;
  readonly swellPercent: number;
}>;
export type SwellFactorVolumeOutput = Readonly<{
  readonly looseVolumeM3: number;
}>;

export const calculateSwellFactorVolume = (
  x: SwellFactorVolumeInput,
): SwellFactorVolumeOutput => {
  if (!Number.isFinite(x.bankVolumeM3) || x.bankVolumeM3 < 0)
    simpleError("bankVolumeM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.swellPercent) || x.swellPercent < 0)
    simpleError("swellPercent", "Provide a finite number at least 0.");
  const looseVolumeM3 = x.bankVolumeM3 * (1 + x.swellPercent / 100);
  if (!Number.isFinite(looseVolumeM3))
    simpleError("looseVolumeM3", "The inputs produce an invalid result.");
  return { looseVolumeM3: Object.is(looseVolumeM3, -0) ? 0 : looseVolumeM3 };
};

export const example = {
  input: { bankVolumeM3: 10, swellPercent: 20 },
  output: { looseVolumeM3: 12 },
} satisfies ToolExample<SwellFactorVolumeInput, SwellFactorVolumeOutput>;

export const tool = createSimpleTool({
  id: "construction/swell-factor-volume",
  title: "Swell Factor Volume",
  description:
    "Convert in-place excavated volume to loose volume with a specified swell percentage.",
  inputs: [
    {
      id: "bankVolumeM3",
      kind: "number",
      label: "In-place bank volume",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "swellPercent",
      kind: "number",
      label: "Swell",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "looseVolumeM3", kind: "number", label: "Loose volume", unit: "m³" },
  ],
  calculate: (input) =>
    calculateSwellFactorVolume({
      bankVolumeM3: input.bankVolumeM3 as number,
      swellPercent: input.swellPercent as number,
    }),
});
export const swellFactorVolumeTool = tool;
export const runSwellFactorVolume = tool.execute;
export default tool;

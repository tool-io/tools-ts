import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CompactionFactorAdjustedVolumeInput = Readonly<{
  readonly looseVolumeM3: number;
  readonly compactedToLooseRatio: number;
}>;
export type CompactionFactorAdjustedVolumeOutput = Readonly<{
  readonly compactedVolumeM3: number;
}>;

export const calculateCompactionFactorAdjustedVolume = (
  x: CompactionFactorAdjustedVolumeInput,
): CompactionFactorAdjustedVolumeOutput => {
  if (!Number.isFinite(x.looseVolumeM3) || x.looseVolumeM3 < 0)
    simpleError("looseVolumeM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.compactedToLooseRatio) || x.compactedToLooseRatio < 0)
    simpleError("compactedToLooseRatio", "Provide a finite number at least 0.");
  if (!(x.compactedToLooseRatio > 0 && x.compactedToLooseRatio <= 1))
    simpleError(
      "compactedToLooseRatio",
      "Ratio must be greater than zero and no more than one.",
    );
  const compactedVolumeM3 = x.looseVolumeM3 * x.compactedToLooseRatio;
  if (!Number.isFinite(compactedVolumeM3))
    simpleError("compactedVolumeM3", "The inputs produce an invalid result.");
  return {
    compactedVolumeM3: Object.is(compactedVolumeM3, -0) ? 0 : compactedVolumeM3,
  };
};

export const example = {
  input: { looseVolumeM3: 10, compactedToLooseRatio: 0.8 },
  output: { compactedVolumeM3: 8 },
} satisfies ToolExample<
  CompactionFactorAdjustedVolumeInput,
  CompactionFactorAdjustedVolumeOutput
>;

export const tool = createSimpleTool({
  id: "construction/compaction-factor-adjusted-volume",
  title: "Compaction Factor Adjusted Volume",
  description:
    "Convert loose soil volume to compacted volume using a measured compacted-to-loose volume ratio.",
  inputs: [
    {
      id: "looseVolumeM3",
      kind: "number",
      label: "Loose volume",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "compactedToLooseRatio",
      kind: "number",
      label: "Compacted-to-loose ratio",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "compactedVolumeM3",
      kind: "number",
      label: "Compacted volume",
      unit: "m³",
    },
  ],
  calculate: (input) =>
    calculateCompactionFactorAdjustedVolume({
      looseVolumeM3: input.looseVolumeM3 as number,
      compactedToLooseRatio: input.compactedToLooseRatio as number,
    }),
});
export const compactionFactorAdjustedVolumeTool = tool;
export const runCompactionFactorAdjustedVolume = tool.execute;
export default tool;

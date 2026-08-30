import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MooreEndgameInput = {
  readonly featureSizeNanometers: number;
};

export type MooreEndgameOutput = {
  readonly featureSizeBand: string;
  readonly scalingNote: string;
};

export const lookupMooreLawEndgameNote = (
  input: MooreEndgameInput,
): MooreEndgameOutput => {
  if (
    !Number.isFinite(input.featureSizeNanometers) ||
    input.featureSizeNanometers <= 0
  )
    simpleError(
      "featureSizeNanometers",
      "Feature size must be a finite value greater than zero.",
      "invalid_feature_size",
    );
  if (input.featureSizeNanometers < 7)
    return {
      featureSizeBand: "below 7 nm",
      scalingNote:
        "Treat further density gains as an open engineering question and do not extrapolate a historical rate as a schedule.",
    };
  if (input.featureSizeNanometers < 65)
    return {
      featureSizeBand: "7 nm to below 65 nm",
      scalingNote:
        "Compare process families explicitly because transistor density, cost, power, and performance do not scale identically.",
    };
  if (input.featureSizeNanometers < 130)
    return {
      featureSizeBand: "65 nm to below 130 nm",
      scalingNote:
        "Use this band for historical comparison and avoid assuming that later nodes will deliver the same cost or power gains.",
    };
  return {
    featureSizeBand: "130 nm and above",
    scalingNote:
      "Treat this as a mature comparison band and evaluate contemporary process transitions separately from a Moore-law trend line.",
  };
};

export const mooreEndgameExample = {
  input: { featureSizeNanometers: 3 },
  output: {
    featureSizeBand: "below 7 nm",
    scalingNote:
      "Treat further density gains as an open engineering question and do not extrapolate a historical rate as a schedule.",
  },
} satisfies ToolExample<MooreEndgameInput, MooreEndgameOutput>;

export const mooreEndgameTool = createSimpleTool({
  calculate: (input) =>
    lookupMooreLawEndgameNote({
      featureSizeNanometers: input.featureSizeNanometers as number,
    }),
  description:
    "Return a process-comparison caution for a caller-supplied transistor feature size instead of projecting Moore-law scaling.",
  id: "futurology/moore-law-transistor-density-endgame-note-lookup",
  inputs: [
    {
      id: "featureSizeNanometers",
      kind: "number",
      label: "Feature size nanometers",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    { id: "featureSizeBand", kind: "string", label: "Feature size band" },
    { id: "scalingNote", kind: "string", label: "Scaling caution" },
  ],
  title: "Moore Law Transistor Density Endgame Note Lookup",
});

export const runMooreEndgame = mooreEndgameTool.execute;
export default mooreEndgameTool;

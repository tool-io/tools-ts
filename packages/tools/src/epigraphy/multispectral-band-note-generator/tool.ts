import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MultispectralBandNoteGeneratorInput = {
  readonly inkType: "iron-gall" | "carbon-based" | "sepia";
  readonly includeUltraviolet?: boolean;
};

export type MultispectralBandNoteGeneratorOutput = {
  readonly recommendedBands: readonly string[];
  readonly note: string;
};

const BANDS: Record<
  MultispectralBandNoteGeneratorInput["inkType"],
  readonly string[]
> = {
  "iron-gall": [
    "365nm UV fluorescence",
    "740nm IR reflectography",
    "850nm IR reflectography",
  ],
  "carbon-based": [
    "450nm blue visible light",
    "850nm IR reflectography",
    "1050nm IR reflectography",
  ],
  sepia: [
    "365nm UV fluorescence",
    "visible-light raking illumination",
    "850nm IR reflectography",
  ],
};

const LABELS: Record<MultispectralBandNoteGeneratorInput["inkType"], string> = {
  "iron-gall": "Iron-gall ink",
  "carbon-based": "Carbon-based ink",
  sepia: "Sepia ink",
};

export const calculateMultispectralBandNoteGenerator = (
  input: MultispectralBandNoteGeneratorInput,
): MultispectralBandNoteGeneratorOutput => {
  const bands = BANDS[input.inkType];
  if (!bands)
    return simpleError(
      "inkType",
      "Unsupported ink type for band selection.",
      "invalid_ink",
    );
  const includeUltraviolet = input.includeUltraviolet ?? true;
  const recommendedBands = includeUltraviolet
    ? bands
    : bands.filter((band) => !band.startsWith("365"));
  return {
    recommendedBands,
    note: `${LABELS[input.inkType]} recommended bands: ${recommendedBands.join("; ")}.`,
  };
};

export const multispectralBandNoteGeneratorExample = {
  input: { inkType: "iron-gall" },
  output: {
    recommendedBands: [
      "365nm UV fluorescence",
      "740nm IR reflectography",
      "850nm IR reflectography",
    ],
    note: "Iron-gall ink recommended bands: 365nm UV fluorescence; 740nm IR reflectography; 850nm IR reflectography.",
  },
} satisfies ToolExample<
  MultispectralBandNoteGeneratorInput,
  MultispectralBandNoteGeneratorOutput
>;

export const multispectralBandNoteGeneratorTool = createSimpleTool({
  id: "epigraphy/multispectral-band-note-generator",
  title: "Multispectral Band Selection Note Generator for Inks",
  description:
    "Generate a deterministic imaging note recommending multispectral capture bands for an ink type from a fixed lookup (iron-gall, carbon-based, sepia), with optional removal of the ultraviolet band.",
  inputs: [
    {
      description: "Ink category under examination.",
      enum: ["iron-gall", "carbon-based", "sepia"],
      id: "inkType",
      kind: "string",
      label: "Ink type",
    },
    {
      default: true,
      description: "Include the 365nm ultraviolet band in the recommendation.",
      id: "includeUltraviolet",
      kind: "boolean",
      label: "Include UV",
    },
  ],
  outputs: [
    {
      description: "Recommended imaging bands in order.",
      id: "recommendedBands",
      kind: "stringList",
      label: "Recommended bands",
    },
    {
      description: "Formatted note sentence listing the recommended bands.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  calculate: (input) =>
    calculateMultispectralBandNoteGenerator(
      input as unknown as MultispectralBandNoteGeneratorInput,
    ),
});

export const runMultispectralBandNoteGenerator =
  multispectralBandNoteGeneratorTool.execute;
export default multispectralBandNoteGeneratorTool;

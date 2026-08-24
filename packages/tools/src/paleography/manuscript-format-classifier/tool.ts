import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ManuscriptFormatClassifierInput = {
  readonly leafHeightMm: number;
  readonly leafWidthMm: number;
  readonly folioMinimumHeightMm?: number;
  readonly quartoMinimumHeightMm?: number;
  readonly octavoMinimumHeightMm?: number;
};

export type ManuscriptFormatClassifierOutput = {
  readonly format: "folio" | "quarto" | "octavo" | "small_format";
  readonly aspectRatio: number;
};

export const calculateManuscriptFormatClassifier = (
  input: ManuscriptFormatClassifierInput,
): ManuscriptFormatClassifierOutput => {
  const folioMinimumHeightMm = input.folioMinimumHeightMm ?? 280;
  const quartoMinimumHeightMm = input.quartoMinimumHeightMm ?? 200;
  const octavoMinimumHeightMm = input.octavoMinimumHeightMm ?? 130;
  for (const key of ["leafHeightMm", "leafWidthMm"] as const) {
    if (!(Number.isFinite(input[key]) && input[key] > 0))
      return simpleError(
        key,
        "Leaf dimensions must be greater than zero.",
        "invalid_dimension",
      );
  }
  if (!(
    folioMinimumHeightMm > quartoMinimumHeightMm &&
    quartoMinimumHeightMm > octavoMinimumHeightMm &&
    octavoMinimumHeightMm > 0 &&
    Number.isFinite(folioMinimumHeightMm) &&
    Number.isFinite(quartoMinimumHeightMm) &&
    Number.isFinite(octavoMinimumHeightMm)
  ))
    return simpleError(
      "folioMinimumHeightMm",
      "Thresholds must decrease strictly from folio to quarto to octavo.",
      "invalid_thresholds",
    );
  const format =
    input.leafHeightMm >= folioMinimumHeightMm
      ? "folio"
      : input.leafHeightMm >= quartoMinimumHeightMm
        ? "quarto"
        : input.leafHeightMm >= octavoMinimumHeightMm
          ? "octavo"
          : "small_format";
  const aspectRatio = input.leafWidthMm / input.leafHeightMm;
  if (!(Number.isFinite(aspectRatio) && aspectRatio > 0))
    return simpleError(
      "leafWidthMm",
      "The dimensions produce an unrepresentable positive aspect ratio.",
      "invalid_dimension",
    );
  return { format, aspectRatio };
};

export const manuscriptFormatClassifierExample = {
  input: { leafHeightMm: 290, leafWidthMm: 210 },
  output: { format: "folio", aspectRatio: 0.7241379310344828 },
} satisfies ToolExample<
  ManuscriptFormatClassifierInput,
  ManuscriptFormatClassifierOutput
>;

export const manuscriptFormatClassifierTool = createSimpleTool({
  id: "paleography/manuscript-format-classifier",
  title: "Manuscript Format Classifier",
  description:
    "Classify a codicological format from measured leaf height under the stated adjustable band convention (foliage of at least 280 mm is folio, 200-279 quarto, 130-199 octavo, below 130 small format) and report the exact width-to-height aspect ratio.",
  inputs: [
    {
      description: "Positive measured leaf height in millimetres.",
      id: "leafHeightMm",
      kind: "number",
      label: "Leaf height",
    },
    {
      description: "Positive measured leaf width in millimetres.",
      id: "leafWidthMm",
      kind: "number",
      label: "Leaf width",
    },
    {
      default: 280,
      description:
        "Positive adjustable folio lower bound in millimetres (stated convention).",
      id: "folioMinimumHeightMm",
      kind: "number",
      label: "Folio min",
    },
    {
      default: 200,
      description:
        "Positive adjustable quarto lower bound in millimetres (stated convention).",
      id: "quartoMinimumHeightMm",
      kind: "number",
      label: "Quarto min",
    },
    {
      default: 130,
      description:
        "Positive adjustable octavo lower bound in millimetres (stated convention).",
      id: "octavoMinimumHeightMm",
      kind: "number",
      label: "Octavo min",
    },
  ],
  outputs: [
    {
      description: "Bibliographic format under the stated bands.",
      id: "format",
      enum: ["folio", "quarto", "octavo", "small_format"],
      kind: "string",
      label: "Format",
    },
    {
      description: "Leaf width divided by leaf height.",
      id: "aspectRatio",
      kind: "number",
      label: "Aspect ratio",
    },
  ],
  calculate: (input) =>
    calculateManuscriptFormatClassifier({
      folioMinimumHeightMm: input.folioMinimumHeightMm as number,
      leafHeightMm: input.leafHeightMm as number,
      leafWidthMm: input.leafWidthMm as number,
      octavoMinimumHeightMm: input.octavoMinimumHeightMm as number,
      quartoMinimumHeightMm: input.quartoMinimumHeightMm as number,
    }),
});

export const runManuscriptFormatClassifier =
  manuscriptFormatClassifierTool.execute;
export default manuscriptFormatClassifierTool;

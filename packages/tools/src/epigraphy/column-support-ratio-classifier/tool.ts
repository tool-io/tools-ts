import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ColumnSupportRatioClassifierInput = {
  readonly diameterCm: number;
  readonly heightCm: number;
  readonly order?: "tuscan" | "doric" | "ionic" | "corinthian" | "composite";
};

export type ColumnSupportRatioClassifierOutput = {
  readonly slendernessRatio: number;
  readonly canonicalHeightDiameters: number;
  readonly deviationDiameters: number;
};

const CANONICAL_HEIGHT_DIAMETERS = {
  tuscan: 7,
  doric: 8,
  ionic: 9,
  corinthian: 10,
  composite: 10,
} as const;

export const calculateColumnSupportRatioClassifier = (
  input: ColumnSupportRatioClassifierInput,
): ColumnSupportRatioClassifierOutput => {
  if (!(input.diameterCm > 0))
    return simpleError(
      "diameterCm",
      "Column diameter must be greater than zero.",
      "invalid_dimension",
    );
  if (!(input.heightCm > 0))
    return simpleError(
      "heightCm",
      "Column height must be greater than zero.",
      "invalid_dimension",
    );
  const canonical = CANONICAL_HEIGHT_DIAMETERS[input.order ?? "doric"];
  const slendernessRatio = input.heightCm / input.diameterCm;
  return {
    slendernessRatio,
    canonicalHeightDiameters: canonical,
    deviationDiameters: slendernessRatio - canonical,
  };
};

export const columnSupportRatioClassifierExample = {
  input: { diameterCm: 50, heightCm: 450, order: "doric" },
  output: {
    slendernessRatio: 9,
    canonicalHeightDiameters: 8,
    deviationDiameters: 1,
  },
} satisfies ToolExample<
  ColumnSupportRatioClassifierInput,
  ColumnSupportRatioClassifierOutput
>;

export const columnSupportRatioClassifierTool = createSimpleTool({
  id: "epigraphy/column-support-ratio-classifier",
  title: "Columnar Support Diameter Height Ratio Classifier",
  description:
    "Classify a columnar inscription support by comparing its height-to-diameter slenderness ratio against the Vitruvian canonical heights for the selected classical order.",
  inputs: [
    {
      description: "Lower column diameter in centimetres.",
      id: "diameterCm",
      kind: "number",
      label: "Diameter",
      minimum: 0,
    },
    {
      description: "Column height in centimetres.",
      id: "heightCm",
      kind: "number",
      label: "Height",
      minimum: 0,
    },
    {
      default: "doric",
      description:
        "Classical order supplying the canonical height in diameters (Tuscan 7, Doric 8, Ionic 9, Corinthian 10, Composite 10).",
      enum: ["tuscan", "doric", "ionic", "corinthian", "composite"],
      id: "order",
      kind: "string",
      label: "Order",
    },
  ],
  outputs: [
    {
      description: "Height divided by lower diameter.",
      id: "slendernessRatio",
      kind: "number",
      label: "Slenderness",
    },
    {
      description:
        "Canonical column height expressed in lower diameters for the order.",
      id: "canonicalHeightDiameters",
      kind: "number",
      label: "Canonical height",
    },
    {
      description: "Measured slenderness minus the canonical value.",
      id: "deviationDiameters",
      kind: "number",
      label: "Deviation",
    },
  ],
  calculate: (input) =>
    calculateColumnSupportRatioClassifier(
      input as unknown as ColumnSupportRatioClassifierInput,
    ),
});

export const runColumnSupportRatioClassifier =
  columnSupportRatioClassifierTool.execute;
export default columnSupportRatioClassifierTool;

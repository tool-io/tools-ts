import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TwoColumnGutterCheckerInput = {
  readonly columnOneWidthMm: number;
  readonly columnTwoWidthMm: number;
  readonly gutterWidthMm: number;
  readonly textBlockWidthMm: number;
  readonly toleranceMm?: number;
};

export type TwoColumnGutterCheckerOutput = {
  readonly discrepancyMillimetres: number;
  readonly layoutConsistent: boolean;
  readonly columnWidthRatio: number;
};

export const calculateTwoColumnGutterChecker = (
  input: TwoColumnGutterCheckerInput,
): TwoColumnGutterCheckerOutput => {
  for (const key of [
    "columnOneWidthMm",
    "columnTwoWidthMm",
    "gutterWidthMm",
    "textBlockWidthMm",
  ] as const) {
    if (!(Number.isFinite(input[key]) && input[key] > 0))
      return simpleError(
        key,
        "Widths must be greater than zero.",
        "invalid_measurement",
      );
  }
  const toleranceMm = input.toleranceMm ?? 1;
  if (!(Number.isFinite(toleranceMm) && toleranceMm >= 0))
    return simpleError(
      "toleranceMm",
      "Tolerance must be non-negative.",
      "invalid_tolerance",
    );
  const discrepancyMillimetres =
    input.columnOneWidthMm +
    input.columnTwoWidthMm +
    input.gutterWidthMm -
    input.textBlockWidthMm;
  const columnWidthRatio = input.columnOneWidthMm / input.columnTwoWidthMm;
  if (
    !Number.isFinite(discrepancyMillimetres) ||
    !Number.isFinite(columnWidthRatio)
  )
    return simpleError(
      "columnOneWidthMm",
      "The layout calculation exceeds the numeric range.",
      "numeric_overflow",
    );
  return {
    discrepancyMillimetres,
    layoutConsistent: Math.abs(discrepancyMillimetres) <= toleranceMm,
    columnWidthRatio,
  };
};

export const twoColumnGutterCheckerExample = {
  input: {
    columnOneWidthMm: 55,
    columnTwoWidthMm: 55,
    gutterWidthMm: 20,
    textBlockWidthMm: 130,
  },
  output: {
    discrepancyMillimetres: 0,
    layoutConsistent: true,
    columnWidthRatio: 1,
  },
} satisfies ToolExample<
  TwoColumnGutterCheckerInput,
  TwoColumnGutterCheckerOutput
>;

export const twoColumnGutterCheckerTool = createSimpleTool({
  id: "paleography/two-column-gutter-checker",
  title: "Two-Column Gutter Checker",
  description:
    "Check whether two measured columns plus their gutter reproduce the full text-block width within a stated default tolerance of one millimetre and report the signed discrepancy and the exact column-width ratio.",
  inputs: [
    {
      description: "First column width in millimetres.",
      id: "columnOneWidthMm",
      kind: "number",
      label: "Column 1",
      minimum: 0,
    },
    {
      description: "Second column width in millimetres.",
      id: "columnTwoWidthMm",
      kind: "number",
      label: "Column 2",
      minimum: 0,
    },
    {
      description: "Gutter between the columns in millimetres.",
      id: "gutterWidthMm",
      kind: "number",
      label: "Gutter",
      minimum: 0,
    },
    {
      description: "Full text-block width in millimetres.",
      id: "textBlockWidthMm",
      kind: "number",
      label: "Block width",
      minimum: 0,
    },
    {
      default: 1,
      description: "Allowed mismatch in millimetres.",
      id: "toleranceMm",
      kind: "number",
      label: "Tolerance",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Signed surplus or deficit against the block width.",
      id: "discrepancyMillimetres",
      kind: "number",
      label: "Discrepancy",
    },
    {
      description: "True when the parts fit the block within tolerance.",
      id: "layoutConsistent",
      kind: "boolean",
      label: "Consistent",
    },
    {
      description: "First column divided by second column.",
      id: "columnWidthRatio",
      kind: "number",
      label: "Width ratio",
    },
  ],
  calculate: (input) =>
    calculateTwoColumnGutterChecker({
      columnOneWidthMm: input.columnOneWidthMm as number,
      columnTwoWidthMm: input.columnTwoWidthMm as number,
      gutterWidthMm: input.gutterWidthMm as number,
      textBlockWidthMm: input.textBlockWidthMm as number,
      toleranceMm: input.toleranceMm as number,
    }),
});

export const runTwoColumnGutterChecker = twoColumnGutterCheckerTool.execute;
export default twoColumnGutterCheckerTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EdgeBoardLengthPalletTotalInput = {
  readonly loadHeightM: number;
  readonly loadLengthM: number;
  readonly loadWidthM: number;
  readonly horizontalBandRows?: number;
};

export type EdgeBoardLengthPalletTotalOutput = {
  readonly verticalEdgeBoardLengthM: number;
  readonly horizontalEdgeBoardLengthM: number;
  readonly totalEdgeBoardLengthM: number;
};

export const calculateEdgeBoardLengthPalletTotal = (
  input: EdgeBoardLengthPalletTotalInput,
): EdgeBoardLengthPalletTotalOutput => {
  for (const key of ["loadHeightM", "loadLengthM", "loadWidthM"] as const) {
    if (!Number.isFinite(input[key]) || input[key] <= 0)
      return simpleError(
        key,
        "Load dimensions must be finite and greater than zero.",
        "invalid_dimension",
      );
  }
  const horizontalBandRows = input.horizontalBandRows ?? 0;
  if (!(Number.isSafeInteger(horizontalBandRows) && horizontalBandRows >= 0))
    return simpleError(
      "horizontalBandRows",
      "The band row count must be a whole number of zero or more.",
      "invalid_bands",
    );
  const verticalEdgeBoardLengthM = 4 * input.loadHeightM;
  const horizontalEdgeBoardLengthM =
    horizontalBandRows * (2 * (input.loadLengthM + input.loadWidthM));
  const totalEdgeBoardLengthM =
    verticalEdgeBoardLengthM + horizontalEdgeBoardLengthM;
  if (
    !Number.isFinite(verticalEdgeBoardLengthM) ||
    !Number.isFinite(horizontalEdgeBoardLengthM) ||
    !Number.isFinite(totalEdgeBoardLengthM)
  )
    return simpleError(
      "loadHeightM",
      "The edge-board length is outside the representable range.",
      "length_out_of_range",
    );
  return {
    verticalEdgeBoardLengthM,
    horizontalEdgeBoardLengthM,
    totalEdgeBoardLengthM,
  };
};

export const edgeBoardLengthPalletTotalExample = {
  input: {
    loadHeightM: 1.8,
    loadLengthM: 1.2,
    loadWidthM: 1,
    horizontalBandRows: 2,
  },
  output: {
    verticalEdgeBoardLengthM: 7.2,
    horizontalEdgeBoardLengthM: 8.8,
    totalEdgeBoardLengthM: 16,
  },
} satisfies ToolExample<
  EdgeBoardLengthPalletTotalInput,
  EdgeBoardLengthPalletTotalOutput
>;

export const edgeBoardLengthPalletTotalTool = createSimpleTool({
  id: "logistics/edge-board-length-pallet-total",
  title: "Edge Board Length Pallet Total",
  description:
    "Total edge-board (corner board) length for a pallet: four vertical boards at full load height plus any horizontal perimeter band rows.",
  inputs: [
    {
      description: "Load height in metres.",
      id: "loadHeightM",
      kind: "number",
      label: "Height",
      minimum: Number.MIN_VALUE,
      unit: "m",
    },
    {
      description: "Load length in metres.",
      id: "loadLengthM",
      kind: "number",
      label: "Length",
      minimum: Number.MIN_VALUE,
      unit: "m",
    },
    {
      description: "Load width in metres.",
      id: "loadWidthM",
      kind: "number",
      label: "Width",
      minimum: Number.MIN_VALUE,
      unit: "m",
    },
    {
      default: 0,
      description: "Number of horizontal band rows around the perimeter.",
      id: "horizontalBandRows",
      kind: "integer",
      label: "Bands",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Combined length of the four corner boards in metres.",
      id: "verticalEdgeBoardLengthM",
      kind: "number",
      label: "Vertical",
    },
    {
      description: "Combined length of the horizontal bands in metres.",
      id: "horizontalEdgeBoardLengthM",
      kind: "number",
      label: "Horizontal",
    },
    {
      description: "Total edge-board length required in metres.",
      id: "totalEdgeBoardLengthM",
      kind: "number",
      label: "Total",
    },
  ],
  calculate: (input) =>
    calculateEdgeBoardLengthPalletTotal({
      horizontalBandRows: input.horizontalBandRows as number | undefined,
      loadHeightM: input.loadHeightM as number,
      loadLengthM: input.loadLengthM as number,
      loadWidthM: input.loadWidthM as number,
    }),
});

export const runEdgeBoardLengthPalletTotal =
  edgeBoardLengthPalletTotalTool.execute;
export default edgeBoardLengthPalletTotalTool;

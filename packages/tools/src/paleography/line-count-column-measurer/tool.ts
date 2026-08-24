import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LineCountColumnMeasurerInput = {
  readonly linesPerColumn: number;
  readonly charactersPerLine: number;
  readonly columnsPerPage?: number;
};

export type LineCountColumnMeasurerOutput = {
  readonly linesPerPage: number;
  readonly charactersPerPage: number;
};

export const calculateLineCountColumnMeasurer = (
  input: LineCountColumnMeasurerInput,
): LineCountColumnMeasurerOutput => {
  for (const key of ["linesPerColumn", "charactersPerLine"] as const) {
    if (!(Number.isSafeInteger(input[key]) && input[key] >= 1))
      return simpleError(
        key,
        "Counts must be positive integers.",
        "invalid_count",
      );
  }
  const columnsPerPage = input.columnsPerPage ?? 1;
  if (!(Number.isSafeInteger(columnsPerPage) && columnsPerPage >= 1))
    return simpleError(
      "columnsPerPage",
      "Column count must be a positive integer.",
      "invalid_count",
    );
  const linesPerPage = input.linesPerColumn * columnsPerPage;
  const charactersPerPage = linesPerPage * input.charactersPerLine;
  if (
    !Number.isSafeInteger(linesPerPage) ||
    !Number.isSafeInteger(charactersPerPage)
  )
    return simpleError(
      "columnsPerPage",
      "The resulting page totals must be safe integers.",
      "invalid_count",
    );
  return { linesPerPage, charactersPerPage };
};

export const lineCountColumnMeasurerExample = {
  input: { linesPerColumn: 40, charactersPerLine: 60, columnsPerPage: 2 },
  output: { linesPerPage: 80, charactersPerPage: 4800 },
} satisfies ToolExample<
  LineCountColumnMeasurerInput,
  LineCountColumnMeasurerOutput
>;

export const lineCountColumnMeasurerTool = createSimpleTool({
  id: "paleography/line-count-column-measurer",
  title: "Line-Count Column Measurer",
  description:
    "Multiply counted ruled lines per column by estimated characters per line and the column count to obtain the exact per-page line total and text-block character estimate.",
  inputs: [
    {
      description: "Ruled or written lines counted in one column.",
      id: "linesPerColumn",
      kind: "integer",
      label: "Lines per column",
      minimum: 1,
    },
    {
      description: "Estimated characters written on one line.",
      id: "charactersPerLine",
      kind: "integer",
      label: "Characters per line",
      minimum: 1,
    },
    {
      default: 1,
      description: "Text columns on each page.",
      id: "columnsPerPage",
      kind: "integer",
      label: "Columns per page",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Lines on a full page across all columns.",
      id: "linesPerPage",
      kind: "integer",
      label: "Lines per page",
    },
    {
      description: "Estimated characters on a full page.",
      id: "charactersPerPage",
      kind: "integer",
      label: "Characters per page",
    },
  ],
  calculate: (input) =>
    calculateLineCountColumnMeasurer({
      charactersPerLine: input.charactersPerLine as number,
      columnsPerPage: input.columnsPerPage as number,
      linesPerColumn: input.linesPerColumn as number,
    }),
});

export const runLineCountColumnMeasurer = lineCountColumnMeasurerTool.execute;
export default lineCountColumnMeasurerTool;

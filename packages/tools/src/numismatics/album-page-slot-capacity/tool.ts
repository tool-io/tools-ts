import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AlbumPageSlotCapacityInput = Readonly<{
  readonly rows: number;
  readonly columns: number;
}>;
export type AlbumPageSlotCapacityOutput = Readonly<{
  readonly slotCount: number;
}>;

export const calculateAlbumPageSlotCapacity = (
  x: AlbumPageSlotCapacityInput,
): AlbumPageSlotCapacityOutput => {
  if (!Number.isFinite(x.rows) || x.rows < 0 || !Number.isSafeInteger(x.rows))
    simpleError("rows", "Provide a nonnegative whole number.");
  if (
    !Number.isFinite(x.columns) ||
    x.columns < 0 ||
    !Number.isSafeInteger(x.columns)
  )
    simpleError("columns", "Provide a nonnegative whole number.");
  const slotCount = x.rows * x.columns;
  if (!Number.isFinite(slotCount))
    simpleError(
      "slotCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { slotCount: Object.is(slotCount, -0) ? 0 : slotCount };
};

export const example = {
  input: {
    rows: 4,
    columns: 5,
  },
  output: { slotCount: 20 },
} satisfies ToolExample<
  AlbumPageSlotCapacityInput,
  AlbumPageSlotCapacityOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/album-page-slot-capacity",
  title: "Album Page Slot Capacity",
  description:
    "Count coin-album slots from a rectangular row-by-column layout.",
  inputs: [
    { id: "rows", kind: "number", label: "Rows", unit: "rows" },
    { id: "columns", kind: "number", label: "Columns", unit: "columns" },
  ],
  outputs: [
    { id: "slotCount", kind: "number", label: "Slot Count", unit: "slots" },
  ],
  calculate: (input) =>
    calculateAlbumPageSlotCapacity({
      rows: input.rows as number,
      columns: input.columns as number,
    }),
});
export const runAlbumPageSlotCapacity = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SlabStorageBoxRowCountInput = Readonly<{
  readonly boxInsideLengthMillimeters: number;
  readonly slabThicknessMillimeters: number;
  readonly rowCount: number;
}>;
export type SlabStorageBoxRowCountOutput = Readonly<{
  readonly slabCapacity: number;
}>;

export const calculateSlabStorageBoxRowCount = (
  x: SlabStorageBoxRowCountInput,
): SlabStorageBoxRowCountOutput => {
  if (
    !Number.isFinite(x.boxInsideLengthMillimeters) ||
    x.boxInsideLengthMillimeters < 0
  )
    simpleError(
      "boxInsideLengthMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.slabThicknessMillimeters) ||
    x.slabThicknessMillimeters <= 0
  )
    simpleError(
      "slabThicknessMillimeters",
      "Provide a finite positive number.",
    );
  if (
    !Number.isFinite(x.rowCount) ||
    x.rowCount < 0 ||
    !Number.isSafeInteger(x.rowCount)
  )
    simpleError("rowCount", "Provide a nonnegative whole number.");
  const slabCapacity =
    Math.floor(x.boxInsideLengthMillimeters / x.slabThicknessMillimeters) *
    x.rowCount;
  if (!Number.isFinite(slabCapacity))
    simpleError(
      "slabCapacity",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { slabCapacity: Object.is(slabCapacity, -0) ? 0 : slabCapacity };
};

export const example = {
  input: {
    boxInsideLengthMillimeters: 300,
    slabThicknessMillimeters: 15,
    rowCount: 2,
  },
  output: { slabCapacity: 40 },
} satisfies ToolExample<
  SlabStorageBoxRowCountInput,
  SlabStorageBoxRowCountOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/slab-storage-box-row-count",
  title: "Slab Storage Box Row Count",
  description:
    "Estimate graded-slab box capacity from usable length, slab thickness, and number of rows.",
  inputs: [
    {
      id: "boxInsideLengthMillimeters",
      kind: "number",
      label: "Box Inside Length Millimeters",
      unit: "mm",
    },
    {
      id: "slabThicknessMillimeters",
      kind: "number",
      label: "Slab Thickness Millimeters",
      unit: "mm",
    },
    { id: "rowCount", kind: "number", label: "Row Count", unit: "rows" },
  ],
  outputs: [
    {
      id: "slabCapacity",
      kind: "number",
      label: "Slab Capacity",
      unit: "slabs",
    },
  ],
  calculate: (input) =>
    calculateSlabStorageBoxRowCount({
      boxInsideLengthMillimeters: input.boxInsideLengthMillimeters as number,
      slabThicknessMillimeters: input.slabThicknessMillimeters as number,
      rowCount: input.rowCount as number,
    }),
});
export const runSlabStorageBoxRowCount = tool.execute;
export default tool;

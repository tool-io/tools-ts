import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StorageBoxFlipCountInput = Readonly<{
  readonly boxInsideLengthMillimeters: number;
  readonly flipThicknessMillimeters: number;
  readonly rowCount: number;
}>;
export type StorageBoxFlipCountOutput = Readonly<{
  readonly flipCapacity: number;
}>;

export const calculateStorageBoxFlipCount = (
  x: StorageBoxFlipCountInput,
): StorageBoxFlipCountOutput => {
  if (
    !Number.isFinite(x.boxInsideLengthMillimeters) ||
    x.boxInsideLengthMillimeters < 0
  )
    simpleError(
      "boxInsideLengthMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.flipThicknessMillimeters) ||
    x.flipThicknessMillimeters <= 0
  )
    simpleError(
      "flipThicknessMillimeters",
      "Provide a finite positive number.",
    );
  if (
    !Number.isFinite(x.rowCount) ||
    x.rowCount < 0 ||
    !Number.isSafeInteger(x.rowCount)
  )
    simpleError("rowCount", "Provide a nonnegative whole number.");
  const flipCapacity =
    Math.floor(x.boxInsideLengthMillimeters / x.flipThicknessMillimeters) *
    x.rowCount;
  if (!Number.isFinite(flipCapacity))
    simpleError(
      "flipCapacity",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { flipCapacity: Object.is(flipCapacity, -0) ? 0 : flipCapacity };
};

export const example = {
  input: {
    boxInsideLengthMillimeters: 300,
    flipThicknessMillimeters: 10,
    rowCount: 2,
  },
  output: { flipCapacity: 60 },
} satisfies ToolExample<StorageBoxFlipCountInput, StorageBoxFlipCountOutput>;

export const tool = createSimpleTool({
  id: "numismatics/storage-box-flip-count",
  title: "Storage Box Flip Count",
  description:
    "Estimate coin-flip capacity from usable row length and flip thickness, without clearance allowance.",
  inputs: [
    {
      id: "boxInsideLengthMillimeters",
      kind: "number",
      label: "Box Inside Length Millimeters",
      unit: "mm",
    },
    {
      id: "flipThicknessMillimeters",
      kind: "number",
      label: "Flip Thickness Millimeters",
      unit: "mm",
    },
    { id: "rowCount", kind: "number", label: "Row Count", unit: "rows" },
  ],
  outputs: [
    {
      id: "flipCapacity",
      kind: "number",
      label: "Flip Capacity",
      unit: "flips",
    },
  ],
  calculate: (input) =>
    calculateStorageBoxFlipCount({
      boxInsideLengthMillimeters: input.boxInsideLengthMillimeters as number,
      flipThicknessMillimeters: input.flipThicknessMillimeters as number,
      rowCount: input.rowCount as number,
    }),
});
export const runStorageBoxFlipCount = tool.execute;
export default tool;

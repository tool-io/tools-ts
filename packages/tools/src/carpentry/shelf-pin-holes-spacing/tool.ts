import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShelfPinHolesSpacingInput = Readonly<{
  readonly firstOffsetMm: number;
  readonly spacingMm: number;
  readonly holeCount: number;
}>;
export type ShelfPinHolesSpacingOutput = Readonly<{
  readonly holePositionsMm: readonly number[];
}>;

export const calculateShelfPinHolesSpacing = (
  x: ShelfPinHolesSpacingInput,
): ShelfPinHolesSpacingOutput => {
  if (!Number.isFinite(x.firstOffsetMm) || x.firstOffsetMm < 0)
    simpleError("firstOffsetMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.spacingMm) || x.spacingMm < 0)
    simpleError("spacingMm", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.holeCount) || x.holeCount < 0)
    simpleError("holeCount", "Provide a safe integer at least 0.");
  if (!(x.holeCount <= 10000 && x.spacingMm > 0))
    simpleError(
      "input",
      "Spacing must be positive and hole count at most 10,000.",
    );
  const holePositionsMm = Array.from(
    { length: x.holeCount },
    (_, i) => x.firstOffsetMm + i * x.spacingMm,
  );
  if (
    !Array.isArray(holePositionsMm) ||
    holePositionsMm.length > 100000 ||
    !holePositionsMm.every((v) => Number.isFinite(v))
  )
    simpleError(
      "holePositionsMm",
      "The inputs produce an invalid number list.",
    );
  return { holePositionsMm: holePositionsMm };
};

export const example = {
  input: { firstOffsetMm: 32, spacingMm: 32, holeCount: 5 },
  output: { holePositionsMm: [32, 64, 96, 128, 160] },
} satisfies ToolExample<ShelfPinHolesSpacingInput, ShelfPinHolesSpacingOutput>;

export const tool = createSimpleTool({
  id: "carpentry/shelf-pin-holes-spacing",
  title: "Shelf Pin Hole Positions",
  description:
    "Generate shelf-pin hole center positions from a first offset, equal hole spacing, and number of holes along one line.",
  inputs: [
    {
      id: "firstOffsetMm",
      kind: "number",
      label: "First hole center from datum",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "spacingMm",
      kind: "number",
      label: "Hole center spacing",
      unit: "mm",
      minimum: 0,
    },
    { id: "holeCount", kind: "integer", label: "Number of holes", minimum: 0 },
  ],
  outputs: [
    {
      id: "holePositionsMm",
      kind: "numberList",
      label: "Hole center positions",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateShelfPinHolesSpacing({
      firstOffsetMm: input.firstOffsetMm as number,
      spacingMm: input.spacingMm as number,
      holeCount: input.holeCount as number,
    }),
});
export const shelfPinHolesSpacingTool = tool;
export const runShelfPinHolesSpacing = tool.execute;
export default tool;

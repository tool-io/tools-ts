import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeafAreaIndexForestryInput = Readonly<{
  readonly oneSidedLeafSquareMeters: number;
  readonly groundSquareMeters: number;
}>;
export type LeafAreaIndexForestryOutput = Readonly<{
  readonly leafAreaIndex: number;
}>;

export const calculateLeafAreaIndexForestry = (
  x: LeafAreaIndexForestryInput,
): LeafAreaIndexForestryOutput => {
  if (
    !Number.isFinite(x.oneSidedLeafSquareMeters) ||
    x.oneSidedLeafSquareMeters < 0
  )
    simpleError(
      "oneSidedLeafSquareMeters",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.groundSquareMeters) || x.groundSquareMeters <= 0)
    simpleError("groundSquareMeters", "Provide a finite positive number.");
  const leafAreaIndex = x.oneSidedLeafSquareMeters / x.groundSquareMeters;
  if (!Number.isFinite(leafAreaIndex))
    simpleError(
      "leafAreaIndex",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { leafAreaIndex: Object.is(leafAreaIndex, -0) ? 0 : leafAreaIndex };
};

export const example = {
  input: {
    oneSidedLeafSquareMeters: 300,
    groundSquareMeters: 100,
  },
  output: { leafAreaIndex: 3 },
} satisfies ToolExample<
  LeafAreaIndexForestryInput,
  LeafAreaIndexForestryOutput
>;

export const tool = createSimpleTool({
  id: "forestry/leaf-area-index-forestry",
  title: "Leaf Area Index Forestry",
  description:
    "One-sided leaf area index: measured one-sided leaf area divided by ground plot area.",
  inputs: [
    {
      id: "oneSidedLeafSquareMeters",
      kind: "number",
      label: "One Sided Leaf Square Meters",
      unit: "m2",
      minimum: 0,
    },
    {
      id: "groundSquareMeters",
      kind: "number",
      label: "Ground Square Meters",
      unit: "m2",
      minimum: 0,
    },
  ],
  outputs: [{ id: "leafAreaIndex", kind: "number", label: "Leaf Area Index" }],
  calculate: (input) =>
    calculateLeafAreaIndexForestry({
      oneSidedLeafSquareMeters: input.oneSidedLeafSquareMeters as number,
      groundSquareMeters: input.groundSquareMeters as number,
    }),
});
export const leafAreaIndexForestryTool = tool;
export const runLeafAreaIndexForestry = tool.execute;
export default tool;

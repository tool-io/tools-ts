import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BraceletLinkAdjustmentInput = Readonly<{
  readonly lengthToRemoveMillimeters: number;
  readonly linkLengthMillimeters: number;
}>;
export type BraceletLinkAdjustmentOutput = Readonly<{
  readonly linksToRemove: number;
}>;

export const calculateBraceletLinkAdjustment = (
  x: BraceletLinkAdjustmentInput,
): BraceletLinkAdjustmentOutput => {
  if (
    !Number.isFinite(x.lengthToRemoveMillimeters) ||
    x.lengthToRemoveMillimeters < 0
  )
    simpleError(
      "lengthToRemoveMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.linkLengthMillimeters) || x.linkLengthMillimeters <= 0)
    simpleError("linkLengthMillimeters", "Provide a finite positive number.");
  const linksToRemove = Math.ceil(
    x.lengthToRemoveMillimeters / x.linkLengthMillimeters,
  );
  if (!Number.isFinite(linksToRemove))
    simpleError(
      "linksToRemove",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { linksToRemove: Object.is(linksToRemove, -0) ? 0 : linksToRemove };
};

export const example = {
  input: {
    lengthToRemoveMillimeters: 20,
    linkLengthMillimeters: 10,
  },
  output: { linksToRemove: 2 },
} satisfies ToolExample<
  BraceletLinkAdjustmentInput,
  BraceletLinkAdjustmentOutput
>;

export const tool = createSimpleTool({
  id: "horology/bracelet-link-adjustment",
  title: "Bracelet Link Adjustment",
  description:
    "Minimum whole removable bracelet links to reduce length by at least a target amount.",
  inputs: [
    {
      id: "lengthToRemoveMillimeters",
      kind: "number",
      label: "Length To Remove Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "linkLengthMillimeters",
      kind: "number",
      label: "Link Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [{ id: "linksToRemove", kind: "number", label: "Links To Remove" }],
  calculate: (input) =>
    calculateBraceletLinkAdjustment({
      lengthToRemoveMillimeters: input.lengthToRemoveMillimeters as number,
      linkLengthMillimeters: input.linkLengthMillimeters as number,
    }),
});
export const braceletLinkAdjustmentTool = tool;
export const runBraceletLinkAdjustment = tool.execute;
export default tool;

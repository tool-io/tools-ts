import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TuerLuftSpaltInput = Readonly<{
  readonly clearOpeningMillimeters: number;
  readonly leafWidthMillimeters: number;
}>;
export type TuerLuftSpaltOutput = Readonly<{
  readonly gapEachSideMillimeters: number;
}>;

export const calculateTuerLuftSpalt = (
  x: TuerLuftSpaltInput,
): TuerLuftSpaltOutput => {
  if (
    !Number.isFinite(x.clearOpeningMillimeters) ||
    x.clearOpeningMillimeters < 0
  )
    simpleError(
      "clearOpeningMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.leafWidthMillimeters) || x.leafWidthMillimeters < 0)
    simpleError("leafWidthMillimeters", "Provide a finite number at least 0.");
  if (x.leafWidthMillimeters > x.clearOpeningMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const gapEachSideMillimeters =
    (x.clearOpeningMillimeters - x.leafWidthMillimeters) / 2;
  if (!Number.isFinite(gapEachSideMillimeters))
    simpleError(
      "gapEachSideMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    gapEachSideMillimeters: Object.is(gapEachSideMillimeters, -0)
      ? 0
      : gapEachSideMillimeters,
  };
};

export const example = {
  input: { clearOpeningMillimeters: 800, leafWidthMillimeters: 794 },
  output: { gapEachSideMillimeters: 3 },
} satisfies ToolExample<TuerLuftSpaltInput, TuerLuftSpaltOutput>;

export const tool = createSimpleTool({
  id: "carpentry/tuer-luft-spalt",
  title: "Tuer Luft Spalt",
  description:
    "Equal left and right side clearance of a centered door leaf inside a wider clear opening.",
  inputs: [
    {
      id: "clearOpeningMillimeters",
      kind: "number",
      label: "Clear Opening Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "leafWidthMillimeters",
      kind: "number",
      label: "Leaf Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "gapEachSideMillimeters",
      kind: "number",
      label: "Gap Each Side Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateTuerLuftSpalt({
      clearOpeningMillimeters: input.clearOpeningMillimeters as number,
      leafWidthMillimeters: input.leafWidthMillimeters as number,
    }),
});
export const tuerLuftSpaltTool = tool;
export const runTuerLuftSpalt = tool.execute;
export default tool;

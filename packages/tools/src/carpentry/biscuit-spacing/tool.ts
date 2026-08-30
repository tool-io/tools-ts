import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BiscuitSpacingInput = Readonly<{
  readonly jointLengthMillimeters: number;
  readonly endOffsetMillimeters: number;
  readonly biscuitCount: number;
}>;
export type BiscuitSpacingOutput = Readonly<{
  readonly centerSpacingMillimeters: number;
}>;

export const calculateBiscuitSpacing = (
  x: BiscuitSpacingInput,
): BiscuitSpacingOutput => {
  if (
    !Number.isFinite(x.jointLengthMillimeters) ||
    x.jointLengthMillimeters < 0
  )
    simpleError(
      "jointLengthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.endOffsetMillimeters) || x.endOffsetMillimeters < 0)
    simpleError("endOffsetMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.biscuitCount) ||
    !Number.isSafeInteger(x.biscuitCount) ||
    x.biscuitCount < 0
  )
    simpleError("biscuitCount", "Provide a safe integer at least 0.");
  if (
    !Number.isSafeInteger(x.biscuitCount) ||
    x.biscuitCount < 2 ||
    x.jointLengthMillimeters <= 2 * x.endOffsetMillimeters
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const centerSpacingMillimeters =
    (x.jointLengthMillimeters - 2 * x.endOffsetMillimeters) /
    (x.biscuitCount - 1);
  if (!Number.isFinite(centerSpacingMillimeters))
    simpleError(
      "centerSpacingMillimeters",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    centerSpacingMillimeters: Object.is(centerSpacingMillimeters, -0)
      ? 0
      : centerSpacingMillimeters,
  };
};

export const example = {
  input: {
    jointLengthMillimeters: 1000,
    endOffsetMillimeters: 100,
    biscuitCount: 5,
  },
  output: { centerSpacingMillimeters: 200 },
} satisfies ToolExample<BiscuitSpacingInput, BiscuitSpacingOutput>;

export const tool = createSimpleTool({
  id: "carpentry/biscuit-spacing",
  title: "Biscuit Spacing",
  description:
    "Equal center-to-center spacing for a chosen number of biscuits placed between equal end offsets along a joint.",
  inputs: [
    {
      id: "jointLengthMillimeters",
      kind: "number",
      label: "Joint Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "endOffsetMillimeters",
      kind: "number",
      label: "End Offset Millimeters",
      unit: "mm",
      minimum: 0,
    },
    { id: "biscuitCount", kind: "integer", label: "Biscuit Count", minimum: 0 },
  ],
  outputs: [
    {
      id: "centerSpacingMillimeters",
      kind: "number",
      label: "Center Spacing Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateBiscuitSpacing({
      jointLengthMillimeters: input.jointLengthMillimeters as number,
      endOffsetMillimeters: input.endOffsetMillimeters as number,
      biscuitCount: input.biscuitCount as number,
    }),
});
export const biscuitSpacingTool = tool;
export const runBiscuitSpacing = tool.execute;
export default tool;

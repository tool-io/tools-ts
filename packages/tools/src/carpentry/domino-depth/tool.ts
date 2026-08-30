import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DominoDepthInput = Readonly<{
  readonly tenonLengthMillimeters: number;
  readonly glueReliefMillimeters: number;
}>;
export type DominoDepthOutput = Readonly<{
  readonly mortiseDepthMillimeters: number;
}>;

export const calculateDominoDepth = (
  x: DominoDepthInput,
): DominoDepthOutput => {
  if (
    !Number.isFinite(x.tenonLengthMillimeters) ||
    x.tenonLengthMillimeters < 0
  )
    simpleError(
      "tenonLengthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.glueReliefMillimeters) || x.glueReliefMillimeters < 0)
    simpleError("glueReliefMillimeters", "Provide a finite number at least 0.");
  const mortiseDepthMillimeters =
    x.tenonLengthMillimeters / 2 + x.glueReliefMillimeters;
  if (!Number.isFinite(mortiseDepthMillimeters))
    simpleError(
      "mortiseDepthMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    mortiseDepthMillimeters: Object.is(mortiseDepthMillimeters, -0)
      ? 0
      : mortiseDepthMillimeters,
  };
};

export const example = {
  input: { tenonLengthMillimeters: 40, glueReliefMillimeters: 1 },
  output: { mortiseDepthMillimeters: 21 },
} satisfies ToolExample<DominoDepthInput, DominoDepthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/domino-depth",
  title: "Domino Depth",
  description:
    "Equal mortise depth in each member for a centered floating tenon, plus a specified glue-relief allowance.",
  inputs: [
    {
      id: "tenonLengthMillimeters",
      kind: "number",
      label: "Tenon Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "glueReliefMillimeters",
      kind: "number",
      label: "Glue Relief Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "mortiseDepthMillimeters",
      kind: "number",
      label: "Mortise Depth Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDominoDepth({
      tenonLengthMillimeters: input.tenonLengthMillimeters as number,
      glueReliefMillimeters: input.glueReliefMillimeters as number,
    }),
});
export const dominoDepthTool = tool;
export const runDominoDepth = tool.execute;
export default tool;

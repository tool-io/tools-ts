import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TextHeightGroundEquivalentInput = Readonly<{
  readonly textHeightMillimeters: number;
  readonly denominator: number;
}>;
export type TextHeightGroundEquivalentOutput = Readonly<{
  readonly groundHeightMeters: number;
}>;

export const calculateTextHeightGroundEquivalent = (
  x: TextHeightGroundEquivalentInput,
): TextHeightGroundEquivalentOutput => {
  if (!Number.isFinite(x.textHeightMillimeters) || x.textHeightMillimeters < 0)
    simpleError(
      "textHeightMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.denominator) || x.denominator <= 0)
    simpleError("denominator", "Provide a finite positive number.");
  const groundHeightMeters = (x.textHeightMillimeters * x.denominator) / 1000;
  if (!Number.isFinite(groundHeightMeters))
    simpleError(
      "groundHeightMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    groundHeightMeters: Object.is(groundHeightMeters, -0)
      ? 0
      : groundHeightMeters,
  };
};

export const example = {
  input: {
    textHeightMillimeters: 2,
    denominator: 50000,
  },
  output: { groundHeightMeters: 100 },
} satisfies ToolExample<
  TextHeightGroundEquivalentInput,
  TextHeightGroundEquivalentOutput
>;

export const tool = createSimpleTool({
  id: "cartography/text-height-ground-equivalent",
  title: "Text Height Ground Equivalent",
  description:
    "Ground height represented by a map text height in millimetres at scale 1:N.",
  inputs: [
    {
      id: "textHeightMillimeters",
      kind: "number",
      label: "Text Height Millimeters",
      unit: "mm",
      minimum: 0,
    },
    { id: "denominator", kind: "number", label: "Denominator", minimum: 0 },
  ],
  outputs: [
    {
      id: "groundHeightMeters",
      kind: "number",
      label: "Ground Height Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateTextHeightGroundEquivalent({
      textHeightMillimeters: input.textHeightMillimeters as number,
      denominator: input.denominator as number,
    }),
});
export const textHeightGroundEquivalentTool = tool;
export const runTextHeightGroundEquivalent = tool.execute;
export default tool;

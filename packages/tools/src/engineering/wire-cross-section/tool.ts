import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WireCrossSectionInput = Readonly<{
  readonly diameterMillimeters: number;
}>;
export type WireCrossSectionOutput = Readonly<{
  readonly areaSquareMillimeters: number;
}>;

export const calculateWireCrossSection = (
  x: WireCrossSectionInput,
): WireCrossSectionOutput => {
  if (!Number.isFinite(x.diameterMillimeters) || x.diameterMillimeters < 0)
    simpleError("diameterMillimeters", "Provide a finite number at least 0.");
  const areaSquareMillimeters = (Math.PI * x.diameterMillimeters ** 2) / 4;
  if (!Number.isFinite(areaSquareMillimeters))
    simpleError(
      "areaSquareMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    areaSquareMillimeters: Object.is(areaSquareMillimeters, -0)
      ? 0
      : areaSquareMillimeters,
  };
};

export const example = {
  input: { diameterMillimeters: 2 },
  output: { areaSquareMillimeters: 3.141592653589793 },
} satisfies ToolExample<WireCrossSectionInput, WireCrossSectionOutput>;

export const tool = createSimpleTool({
  id: "engineering/wire-cross-section",
  title: "Wire Cross Section",
  description:
    "Circular solid conductor cross-sectional area from measured diameter, excluding insulation.",
  inputs: [
    {
      id: "diameterMillimeters",
      kind: "number",
      label: "Diameter Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "areaSquareMillimeters",
      kind: "number",
      label: "Area Square Millimeters",
      unit: "mm²",
    },
  ],
  calculate: (input) =>
    calculateWireCrossSection({
      diameterMillimeters: input.diameterMillimeters as number,
    }),
});
export const wireCrossSectionTool = tool;
export const runWireCrossSection = tool.execute;
export default tool;

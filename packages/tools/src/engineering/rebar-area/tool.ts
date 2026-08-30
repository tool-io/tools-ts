import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RebarAreaInput = Readonly<{
  readonly diameterMillimeters: number;
}>;
export type RebarAreaOutput = Readonly<{
  readonly areaSquareMillimeters: number;
}>;

export const calculateRebarArea = (x: RebarAreaInput): RebarAreaOutput => {
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
  input: { diameterMillimeters: 16 },
  output: { areaSquareMillimeters: 201.06192982974676 },
} satisfies ToolExample<RebarAreaInput, RebarAreaOutput>;

export const tool = createSimpleTool({
  id: "engineering/rebar-area",
  title: "Rebar Area",
  description:
    "Circular reinforcing bar cross-sectional area from nominal bar diameter, not including ribs.",
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
    calculateRebarArea({
      diameterMillimeters: input.diameterMillimeters as number,
    }),
});
export const rebarAreaTool = tool;
export const runRebarArea = tool.execute;
export default tool;

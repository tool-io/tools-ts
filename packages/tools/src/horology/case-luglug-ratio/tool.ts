import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CaseLuglugRatioInput = Readonly<{
  readonly lugToLugMillimeters: number;
  readonly wristWidthMillimeters: number;
}>;
export type CaseLuglugRatioOutput = Readonly<{
  readonly ratio: number;
}>;

export const calculateCaseLuglugRatio = (
  x: CaseLuglugRatioInput,
): CaseLuglugRatioOutput => {
  if (!Number.isFinite(x.lugToLugMillimeters) || x.lugToLugMillimeters <= 0)
    simpleError("lugToLugMillimeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.wristWidthMillimeters) || x.wristWidthMillimeters <= 0)
    simpleError("wristWidthMillimeters", "Provide a finite positive number.");
  const ratio = x.lugToLugMillimeters / x.wristWidthMillimeters;
  if (!Number.isFinite(ratio))
    simpleError("ratio", "Inputs produce an undefined or out-of-range result.");
  return { ratio: Object.is(ratio, -0) ? 0 : ratio };
};

export const example = {
  input: {
    lugToLugMillimeters: 50,
    wristWidthMillimeters: 60,
  },
  output: { ratio: 0.8333333333333334 },
} satisfies ToolExample<CaseLuglugRatioInput, CaseLuglugRatioOutput>;

export const tool = createSimpleTool({
  id: "horology/case-luglug-ratio",
  title: "Case Luglug Ratio",
  description:
    "Watch lug-to-lug span divided by wearer wrist width, using matching length units.",
  inputs: [
    {
      id: "lugToLugMillimeters",
      kind: "number",
      label: "Lug To Lug Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "wristWidthMillimeters",
      kind: "number",
      label: "Wrist Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [{ id: "ratio", kind: "number", label: "Ratio" }],
  calculate: (input) =>
    calculateCaseLuglugRatio({
      lugToLugMillimeters: input.lugToLugMillimeters as number,
      wristWidthMillimeters: input.wristWidthMillimeters as number,
    }),
});
export const caseLuglugRatioTool = tool;
export const runCaseLuglugRatio = tool.execute;
export default tool;

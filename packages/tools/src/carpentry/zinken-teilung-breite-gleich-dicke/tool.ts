import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ZinkenTeilungBreiteGleichDickeInput = Readonly<{
  readonly jointLengthMillimeters: number;
  readonly stockThicknessMillimeters: number;
}>;
export type ZinkenTeilungBreiteGleichDickeOutput = Readonly<{
  readonly fullFingerCount: number;
  readonly unusedMillimeters: number;
}>;

export const calculateZinkenTeilungBreiteGleichDicke = (
  x: ZinkenTeilungBreiteGleichDickeInput,
): ZinkenTeilungBreiteGleichDickeOutput => {
  if (
    !Number.isFinite(x.jointLengthMillimeters) ||
    x.jointLengthMillimeters < 0
  )
    simpleError(
      "jointLengthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.stockThicknessMillimeters) ||
    x.stockThicknessMillimeters < 0
  )
    simpleError(
      "stockThicknessMillimeters",
      "Provide a finite number at least 0.",
    );
  const fullFingerCount = Math.floor(
    x.jointLengthMillimeters / x.stockThicknessMillimeters,
  );
  if (
    !Number.isFinite(fullFingerCount) ||
    !Number.isSafeInteger(fullFingerCount)
  )
    simpleError(
      "fullFingerCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  const unusedMillimeters =
    x.jointLengthMillimeters % x.stockThicknessMillimeters;
  if (!Number.isFinite(unusedMillimeters))
    simpleError(
      "unusedMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    fullFingerCount: Object.is(fullFingerCount, -0) ? 0 : fullFingerCount,
    unusedMillimeters: Object.is(unusedMillimeters, -0) ? 0 : unusedMillimeters,
  };
};

export const example = {
  input: { jointLengthMillimeters: 100, stockThicknessMillimeters: 20 },
  output: { fullFingerCount: 5, unusedMillimeters: 0 },
} satisfies ToolExample<
  ZinkenTeilungBreiteGleichDickeInput,
  ZinkenTeilungBreiteGleichDickeOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/zinken-teilung-breite-gleich-dicke",
  title: "Zinken Teilung Breite Gleich Dicke",
  description:
    "Maximum count of full-width equal fingers when target finger width equals stock thickness, plus unused length.",
  inputs: [
    {
      id: "jointLengthMillimeters",
      kind: "number",
      label: "Joint Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "stockThicknessMillimeters",
      kind: "number",
      label: "Stock Thickness Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "fullFingerCount", kind: "integer", label: "Full Finger Count" },
    {
      id: "unusedMillimeters",
      kind: "number",
      label: "Unused Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateZinkenTeilungBreiteGleichDicke({
      jointLengthMillimeters: input.jointLengthMillimeters as number,
      stockThicknessMillimeters: input.stockThicknessMillimeters as number,
    }),
});
export const zinkenTeilungBreiteGleichDickeTool = tool;
export const runZinkenTeilungBreiteGleichDicke = tool.execute;
export default tool;

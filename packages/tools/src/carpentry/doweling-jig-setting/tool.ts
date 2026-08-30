import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DowelingJigSettingInput = Readonly<{
  readonly stockThicknessMm: number;
}>;
export type DowelingJigSettingOutput = Readonly<{
  readonly centerOffsetMm: number;
}>;

export const calculateDowelingJigSetting = (
  x: DowelingJigSettingInput,
): DowelingJigSettingOutput => {
  if (!Number.isFinite(x.stockThicknessMm) || x.stockThicknessMm < 0)
    simpleError("stockThicknessMm", "Provide a finite number at least 0.");
  const centerOffsetMm = x.stockThicknessMm / 2;
  if (!Number.isFinite(centerOffsetMm))
    simpleError("centerOffsetMm", "The inputs produce an invalid result.");
  return { centerOffsetMm: Object.is(centerOffsetMm, -0) ? 0 : centerOffsetMm };
};

export const example = {
  input: { stockThicknessMm: 18 },
  output: { centerOffsetMm: 9 },
} satisfies ToolExample<DowelingJigSettingInput, DowelingJigSettingOutput>;

export const tool = createSimpleTool({
  id: "carpentry/doweling-jig-setting",
  title: "Doweling Jig Setting",
  description:
    "Place a centered dowel-jig guide at half the measured stock thickness from either face.",
  inputs: [
    {
      id: "stockThicknessMm",
      kind: "number",
      label: "Stock thickness",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "centerOffsetMm",
      kind: "number",
      label: "Guide center offset",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDowelingJigSetting({
      stockThicknessMm: input.stockThicknessMm as number,
    }),
});
export const dowelingJigSettingTool = tool;
export const runDowelingJigSetting = tool.execute;
export default tool;

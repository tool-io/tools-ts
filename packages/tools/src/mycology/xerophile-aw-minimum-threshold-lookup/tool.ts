import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type XerophileAwMinimumThresholdLookupInput = {
  readonly extremeXerophileMaximumAw: number;
  readonly minimumAw: number;
  readonly xerophileMaximumAw: number;
  readonly xerotolerantMaximumAw: number;
};

export type XerophileAwMinimumThresholdLookupOutput = {
  readonly waterActivityClass:
    "extreme-xerophile" | "xerophile" | "xerotolerant" | "mesophile";
};

export const xerophileAwMinimumThresholdLookupExample = {
  input: {
    extremeXerophileMaximumAw: 0.75,
    minimumAw: 0.83,
    xerophileMaximumAw: 0.85,
    xerotolerantMaximumAw: 0.91,
  },
  output: { waterActivityClass: "xerophile" },
} satisfies ToolExample<
  XerophileAwMinimumThresholdLookupInput,
  XerophileAwMinimumThresholdLookupOutput
>;

export const xerophileAwMinimumThresholdLookupTool = createSimpleTool({
  id: "mycology/xerophile-aw-minimum-threshold-lookup",
  title: "Water Activity Growth Classifier",
  description:
    "Classify an observed minimum growth water activity with explicitly supplied laboratory or reference cutoffs; water-activity terminology is not governed by one universal set of numerical boundaries.",
  inputs: [
    {
      description: "Upper cutoff used for the extreme-xerophile class.",
      id: "extremeXerophileMaximumAw",
      kind: "number",
      label: "Extreme-xerophile cutoff",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "minimumAw",
      kind: "number",
      label: "Minimum water activity",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Upper cutoff used for the xerophile class.",
      id: "xerophileMaximumAw",
      kind: "number",
      label: "Xerophile cutoff",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Upper cutoff used for the xerotolerant class.",
      id: "xerotolerantMaximumAw",
      kind: "number",
      label: "Xerotolerant cutoff",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      enum: ["extreme-xerophile", "xerophile", "xerotolerant", "mesophile"],
      id: "waterActivityClass",
      kind: "string",
      label: "Water activity class",
    },
  ],
  calculate: (input) => {
    const minimumAw = input.minimumAw as number;
    const extremeMaximum = input.extremeXerophileMaximumAw as number;
    const xerophileMaximum = input.xerophileMaximumAw as number;
    const xerotolerantMaximum = input.xerotolerantMaximumAw as number;
    if (!(
      extremeMaximum < xerophileMaximum &&
      xerophileMaximum < xerotolerantMaximum
    )) {
      simpleError(
        "xerophileMaximumAw",
        "Water-activity cutoffs must increase from extreme xerophile to xerotolerant.",
        "invalid_value",
      );
    }
    return {
      waterActivityClass:
        minimumAw <= extremeMaximum
          ? "extreme-xerophile"
          : minimumAw <= xerophileMaximum
            ? "xerophile"
            : minimumAw <= xerotolerantMaximum
              ? "xerotolerant"
              : "mesophile",
    };
  },
});
export const runXerophileAwMinimumThresholdLookup =
  xerophileAwMinimumThresholdLookupTool.execute;
export default xerophileAwMinimumThresholdLookupTool;

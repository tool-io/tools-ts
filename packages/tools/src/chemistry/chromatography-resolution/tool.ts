import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChromatographyResolutionInput = {
  readonly rt1: number;
  readonly rt2: number;
  readonly w1: number;
  readonly w2: number;
};

export type ChromatographyResolutionOutput = {
  readonly resolution: number;
};

export const chromatographyResolutionExample = {
  input: { rt1: 5, rt2: 7, w1: 1, w2: 1 },
  output: { resolution: 2 },
} satisfies ToolExample<
  ChromatographyResolutionInput,
  ChromatographyResolutionOutput
>;

export const chromatographyResolutionTool = createSimpleTool({
  id: "chemistry/chromatography-resolution",
  title: "Chromatographic Resolution",
  description:
    "Compute chromatographic resolution Rs as twice the retention time separation divided by the summed baseline peak widths.",
  inputs: [
    { id: "rt1", label: "First retention time", kind: "number", unit: "min" },
    { id: "rt2", label: "Second retention time", kind: "number", unit: "min" },
    { id: "w1", label: "First baseline width", kind: "number", unit: "min" },
    { id: "w2", label: "Second baseline width", kind: "number", unit: "min" },
  ],
  outputs: [{ id: "resolution", label: "Resolution", kind: "number" }],
  calculate: (input) => {
    const rt1 = input.rt1 as number;
    const rt2 = input.rt2 as number;
    const w1 = input.w1 as number;
    const w2 = input.w2 as number;
    if (!(rt1 > 0))
      simpleError(
        "rt1",
        "First retention time must be positive.",
        "invalid_times",
      );
    if (!(rt2 > rt1))
      simpleError(
        "rt2",
        "Second retention time must exceed the first.",
        "invalid_times",
      );
    if (!(w1 > 0))
      simpleError("w1", "Baseline widths must be positive.", "invalid_widths");
    if (!(w2 > 0))
      simpleError("w2", "Baseline widths must be positive.", "invalid_widths");
    return { resolution: (2 * (rt2 - rt1)) / (w1 + w2) };
  },
});
export const runChromatographyResolution = chromatographyResolutionTool.execute;
export default chromatographyResolutionTool;

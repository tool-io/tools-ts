import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ContrastRatioInput = Readonly<{
  readonly maximumNits: number;
  readonly minimumNits: number;
}>;
export type ContrastRatioOutput = Readonly<{
  readonly contrastRatio: number;
}>;

export const calculateContrastRatio = (
  x: ContrastRatioInput,
): ContrastRatioOutput => {
  if (!Number.isFinite(x.maximumNits) || x.maximumNits < 0)
    simpleError("maximumNits", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.minimumNits) || x.minimumNits < 0)
    simpleError("minimumNits", "Provide a finite number at least 0.");
  if (x.maximumNits < x.minimumNits)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const contrastRatio = x.maximumNits / x.minimumNits;
  if (!Number.isFinite(contrastRatio))
    simpleError(
      "contrastRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { contrastRatio: Object.is(contrastRatio, -0) ? 0 : contrastRatio };
};

export const example = {
  input: { maximumNits: 1000, minimumNits: 1 },
  output: { contrastRatio: 1000 },
} satisfies ToolExample<ContrastRatioInput, ContrastRatioOutput>;

export const tool = createSimpleTool({
  id: "film/contrast-ratio",
  title: "Contrast Ratio",
  description:
    "Contrast ratio from measured maximum and minimum luminance under the same viewing conditions.",
  inputs: [
    {
      id: "maximumNits",
      kind: "number",
      label: "Maximum Nits",
      unit: "cd/m²",
      minimum: 0,
    },
    {
      id: "minimumNits",
      kind: "number",
      label: "Minimum Nits",
      unit: "cd/m²",
      minimum: 0,
    },
  ],
  outputs: [{ id: "contrastRatio", kind: "number", label: "Contrast Ratio" }],
  calculate: (input) =>
    calculateContrastRatio({
      maximumNits: input.maximumNits as number,
      minimumNits: input.minimumNits as number,
    }),
});
export const contrastRatioTool = tool;
export const runContrastRatio = tool.execute;
export default tool;

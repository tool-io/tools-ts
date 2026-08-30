import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CentsToRatioConverterInput = Readonly<{
  readonly cents: number;
}>;
export type CentsToRatioConverterOutput = Readonly<{
  readonly frequencyRatio: number;
}>;

export const calculateCentsToRatioConverter = (
  x: CentsToRatioConverterInput,
): CentsToRatioConverterOutput => {
  if (!Number.isFinite(x.cents))
    simpleError("cents", "Provide a finite number.");
  const frequencyRatio = 2 ** (x.cents / 1200);
  if (!Number.isFinite(frequencyRatio))
    simpleError(
      "frequencyRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { frequencyRatio: Object.is(frequencyRatio, -0) ? 0 : frequencyRatio };
};

export const example = {
  input: {
    cents: 1200,
  },
  output: { frequencyRatio: 2 },
} satisfies ToolExample<
  CentsToRatioConverterInput,
  CentsToRatioConverterOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/cents-to-ratio-converter",
  title: "Cents To Ratio Converter",
  description: "Frequency ratio corresponding to a signed interval in cents.",
  inputs: [{ id: "cents", kind: "number", label: "Cents", unit: "cent" }],
  outputs: [{ id: "frequencyRatio", kind: "number", label: "Frequency Ratio" }],
  calculate: (input) =>
    calculateCentsToRatioConverter({
      cents: input.cents as number,
    }),
});
export const centsToRatioConverterTool = tool;
export const runCentsToRatioConverter = tool.execute;
export default tool;

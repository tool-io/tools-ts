import { createSimpleTool, simpleError } from "../../core/simple.js";
export const markupMarginTool = createSimpleTool({
  id: "finance/markup-margin",
  title: "Markup and Margin Converter",
  description: "Convert between markup and gross margin percentages.",
  inputs: [
    { id: "percent", label: "Percentage", kind: "number", unit: "%" },
    { id: "mode", label: "Conversion mode", kind: "string" },
  ],
  outputs: [
    { id: "percent", label: "Converted percentage", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    const value = input.percent as number;
    if (value < 0) simpleError("percent", "Percentage must be nonnegative.");
    if (input.mode === "markup-to-margin")
      return { percent: (value / (100 + value)) * 100 };
    if (input.mode === "margin-to-markup") {
      if (value >= 100)
        simpleError("percent", "Margin must be below 100 percent.");
      return { percent: (value / (100 - value)) * 100 };
    }
    return simpleError(
      "mode",
      "Mode must be markup-to-margin or margin-to-markup.",
    );
  },
});
export const runMarkupMargin = markupMarginTool.execute;
export default markupMarginTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const conidiaRatioClassifierExample = {
  input: { macroConidiaInt: 2, microConidiaInt: 8 },
  output: { dominantForm: "microconidia-dominant", microMacroRatio: 4 },
} satisfies ToolExample<
  { readonly macroConidiaInt: number; readonly microConidiaInt: number },
  { readonly dominantForm: string; readonly microMacroRatio: number }
>;

export const conidiaRatioClassifierTool = createSimpleTool({
  id: "mycology/micro-macro-conidia-ratio-classifier",
  title: "Micro/Macro Ratio Class",
  description:
    "Classify the dominant conidial form and compute the micro-to-macroconidia ratio.",
  inputs: [
    {
      id: "microConidiaInt",
      kind: "integer",
      label: "Microconidia count",
      minimum: 0,
    },
    {
      id: "macroConidiaInt",
      kind: "integer",
      label: "Macroconidia count",
      minimum: 0,
    },
  ],
  outputs: [
    {
      enum: ["macroconidia-dominant", "microconidia-dominant", "equal"],
      id: "dominantForm",
      kind: "string",
      label: "Dominant form",
    },
    { id: "microMacroRatio", kind: "number", label: "Micro/macro ratio" },
  ],
  calculate: (input) => {
    const micro = input.microConidiaInt as number;
    const macro = input.macroConidiaInt as number;
    if (micro + macro === 0)
      simpleError(
        "microConidiaInt",
        "At least one conidium must be counted.",
        "no_conidia",
      );
    if (macro === 0)
      simpleError(
        "macroConidiaInt",
        "The micro-to-macro ratio is undefined when the macroconidia count is zero.",
        "zero_denominator",
      );
    const dominantForm =
      macro > micro
        ? "macroconidia-dominant"
        : micro > macro
          ? "microconidia-dominant"
          : "equal";
    return { dominantForm, microMacroRatio: micro / macro };
  },
});
export const runConidiaRatioClassifier = conidiaRatioClassifierTool.execute;
export default conidiaRatioClassifierTool;

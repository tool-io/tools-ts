import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const ventilationPerfusionMismatchExample = {
  input: { vqRatio: 1 },
  output: { mismatchCategory: "normal" },
} satisfies ToolExample<
  { readonly vqRatio: number },
  { readonly mismatchCategory: string }
>;

export const ventilationPerfusionMismatchTool = createSimpleTool({
  id: "biology/ventilation-perfusion-mismatch",
  title: "V/Q Mismatch Category",
  description:
    "Classify a ventilation-perfusion ratio as shunt below 0.3, low up to 0.8, normal below 1.5, and dead-space otherwise.",
  inputs: [
    {
      id: "vqRatio",
      label: "Ventilation-perfusion ratio",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "mismatchCategory",
      label: "Mismatch category",
      kind: "string",
      enum: ["shunt", "low", "normal", "dead-space"],
    },
  ],
  calculate: (input) => {
    const vqRatio = input.vqRatio as number;
    return {
      mismatchCategory:
        vqRatio < 0.3
          ? "shunt"
          : vqRatio <= 0.8
            ? "low"
            : vqRatio < 1.5
              ? "normal"
              : "dead-space",
    };
  },
});
export const runVentilationPerfusionMismatch =
  ventilationPerfusionMismatchTool.execute;
export default ventilationPerfusionMismatchTool;

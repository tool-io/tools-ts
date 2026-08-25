import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const fev1FvcRatioExample = {
  input: { fev1L: 3.5, fvcL: 4.5 },
  output: { fev1FvcRatio: 0.7777777777777778 },
} satisfies ToolExample<
  { readonly fev1L: number; readonly fvcL: number },
  { readonly fev1FvcRatio: number }
>;

export const fev1FvcRatioTool = createSimpleTool({
  id: "biology/fev1-fvc-ratio",
  title: "FEV1/FVC Ratio",
  description:
    "Compute the FEV1/FVC ratio from forced expiratory volume in one second and forced vital capacity in litres.",
  inputs: [
    {
      id: "fev1L",
      kind: "number",
      label: "FEV1",
      minimum: 0,
      unit: "L",
    },
    {
      id: "fvcL",
      kind: "number",
      label: "FVC",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      id: "fev1FvcRatio",
      kind: "number",
      label: "FEV1/FVC ratio",
    },
  ],
  calculate: (input) => {
    const fev1L = input.fev1L as number;
    const fvcL = input.fvcL as number;
    if (fev1L < 0)
      simpleError("fev1L", "FEV1 must not be negative.", "invalid_volumes");
    if (!(fvcL > 0))
      simpleError("fvcL", "FVC must be positive.", "invalid_volumes");
    if (fev1L > fvcL)
      simpleError("fev1L", "FEV1 must not exceed FVC.", "invalid_volumes");
    return { fev1FvcRatio: fev1L / fvcL };
  },
});
export const runFev1FvcRatio = fev1FvcRatioTool.execute;
export default fev1FvcRatioTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const alveolarArterialGradientExample = {
  input: { fiO2Fraction: 0.21, paco2Mmhg: 40, patmMmhg: 760, pao2Mmhg: 95 },
  output: { aaGradientMmhg: 4.72999999999999 },
} satisfies ToolExample<
  {
    readonly fiO2Fraction: number;
    readonly paco2Mmhg: number;
    readonly patmMmhg: number;
    readonly pao2Mmhg: number;
  },
  { readonly aaGradientMmhg: number }
>;

export const alveolarArterialGradientTool = createSimpleTool({
  id: "biology/alveolar-arterial-gradient",
  title: "A-a Gradient",
  description:
    "Compute the alveolar-arterial oxygen gradient as fiO2 x (patm - 47) - paco2 / 0.8 - pao2.",
  inputs: [
    {
      id: "fiO2Fraction",
      label: "Inspired oxygen fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "patmMmhg",
      label: "Atmospheric pressure",
      kind: "number",
      unit: "mmHg",
    },
    { id: "paco2Mmhg", label: "Arterial CO2", kind: "number", unit: "mmHg" },
    { id: "pao2Mmhg", label: "Arterial O2", kind: "number", unit: "mmHg" },
  ],
  outputs: [
    {
      id: "aaGradientMmhg",
      label: "A-a gradient",
      kind: "number",
      unit: "mmHg",
    },
  ],
  calculate: (input) => {
    const patmMmhg = input.patmMmhg as number;
    const paco2Mmhg = input.paco2Mmhg as number;
    const pao2Mmhg = input.pao2Mmhg as number;
    if (patmMmhg <= 0)
      simpleError("patmMmhg", "Atmospheric pressure must be positive.");
    if (paco2Mmhg <= 0)
      simpleError("paco2Mmhg", "Arterial CO2 must be positive.");
    if (pao2Mmhg <= 0) simpleError("pao2Mmhg", "Arterial O2 must be positive.");
    return {
      aaGradientMmhg:
        (input.fiO2Fraction as number) * (patmMmhg - 47) -
        paco2Mmhg / 0.8 -
        pao2Mmhg,
    };
  },
});
export const runAlveolarArterialGradient = alveolarArterialGradientTool.execute;
export default alveolarArterialGradientTool;

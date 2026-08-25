import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const arterialAlveolarRatioExample = {
  input: { fiO2Fraction: 0.4, pacO2Mmhg: 40, paO2Mmhg: 100, patmMmhg: 760 },
  output: { arterialAlveolarRatio: 0.4251700680272109 },
} satisfies ToolExample<
  {
    readonly fiO2Fraction: number;
    readonly pacO2Mmhg: number;
    readonly paO2Mmhg: number;
    readonly patmMmhg: number;
  },
  { readonly arterialAlveolarRatio: number }
>;

export const arterialAlveolarRatioTool = createSimpleTool({
  id: "biology/arterial-alveolar-ratio",
  title: "a/A Ratio",
  description:
    "Compute the arterial-to-alveolar oxygen ratio as PaO2 divided by the alveolar oxygen tension from the simplified alveolar gas equation.",
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
    { id: "pacO2Mmhg", label: "Arterial CO2", kind: "number", unit: "mmHg" },
    { id: "paO2Mmhg", label: "Arterial O2", kind: "number", unit: "mmHg" },
  ],
  outputs: [
    {
      id: "arterialAlveolarRatio",
      label: "a/A ratio",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const fiO2Fraction = input.fiO2Fraction as number;
    const patmMmhg = input.patmMmhg as number;
    const pacO2Mmhg = input.pacO2Mmhg as number;
    const paO2Mmhg = input.paO2Mmhg as number;
    if (patmMmhg <= 0)
      simpleError(
        "patmMmhg",
        "Atmospheric pressure must be greater than zero.",
      );
    if (pacO2Mmhg <= 0)
      simpleError("pacO2Mmhg", "Arterial CO2 must be greater than zero.");
    if (paO2Mmhg <= 0)
      simpleError("paO2Mmhg", "Arterial O2 must be greater than zero.");
    const alveolarPo2Mmhg = fiO2Fraction * (patmMmhg - 47) - pacO2Mmhg / 0.8;
    if (alveolarPo2Mmhg <= 0)
      simpleError(
        "fiO2Fraction",
        "The alveolar oxygen tension must be greater than zero.",
        "invalid_alveolar",
      );
    return {
      arterialAlveolarRatio: paO2Mmhg / alveolarPo2Mmhg,
    };
  },
});
export const runArterialAlveolarRatio = arterialAlveolarRatioTool.execute;
export default arterialAlveolarRatioTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const alveolarGasEquationExample = {
  input: { fiO2Fraction: 0.21, patmMmhg: 760, paco2Mmhg: 40 },
  output: { alveolarPo2Mmhg: 99.72999999999999 },
} satisfies ToolExample<
  {
    readonly fiO2Fraction: number;
    readonly paco2Mmhg: number;
    readonly patmMmhg: number;
    readonly ph2oMmhg?: number;
    readonly respiratoryQuotient?: number;
  },
  { readonly alveolarPo2Mmhg: number }
>;

export const alveolarGasEquationTool = createSimpleTool({
  id: "biology/alveolar-gas-equation",
  title: "Alveolar Gas Equation",
  description:
    "Compute the ideal alveolar oxygen pressure PAO2 = FiO2 x (Patm - PH2O) - PaCO2 / R, with water vapour pressure defaulting to 47 mmHg at body temperature and respiratory quotient R defaulting to 0.8.",
  inputs: [
    {
      description: "Inspired oxygen fraction between 0 and 1.",
      id: "fiO2Fraction",
      label: "FiO2",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Atmospheric pressure; must be greater than zero.",
      id: "patmMmhg",
      label: "Atmospheric pressure",
      kind: "number",
      unit: "mmHg",
    },
    {
      description:
        "Arterial carbon dioxide pressure; must be greater than zero.",
      id: "paco2Mmhg",
      label: "PaCO2",
      kind: "number",
      unit: "mmHg",
    },
    {
      default: 47,
      description: "Water vapour pressure; defaults to 47 mmHg.",
      id: "ph2oMmhg",
      label: "PH2O",
      kind: "number",
      unit: "mmHg",
    },
    {
      default: 0.8,
      description: "Respiratory quotient between 0.7 and 1; defaults to 0.8.",
      id: "respiratoryQuotient",
      label: "Respiratory quotient",
      kind: "number",
      maximum: 1,
      minimum: 0.7,
    },
  ],
  outputs: [
    {
      description: "Ideal alveolar partial pressure of oxygen.",
      id: "alveolarPo2Mmhg",
      label: "Alveolar PO2",
      kind: "number",
      unit: "mmHg",
    },
  ],
  calculate: (input) => {
    const fiO2Fraction = input.fiO2Fraction as number;
    const patmMmhg = input.patmMmhg as number;
    const paco2Mmhg = input.paco2Mmhg as number;
    if (!(patmMmhg > 0))
      simpleError(
        "patmMmhg",
        "The atmospheric pressure must be greater than zero.",
      );
    if (!(paco2Mmhg > 0))
      simpleError("paco2Mmhg", "The PaCO2 must be greater than zero.");
    return {
      alveolarPo2Mmhg:
        fiO2Fraction * (patmMmhg - (input.ph2oMmhg as number)) -
        paco2Mmhg / (input.respiratoryQuotient as number),
    };
  },
});
export const runAlveolarGasEquation = alveolarGasEquationTool.execute;
export default alveolarGasEquationTool;

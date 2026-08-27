import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MgNumberVsSilicaInput = {
  readonly mgoWtPercent: number;
  readonly feOWtPercent: number;
  readonly fe2O3WtPercent?: number;
  readonly siO2WtPercent: number;
};

export type MgNumberVsSilicaOutput = {
  readonly mgNumberMolar: number;
  readonly feOTotalWtPercent: number;
  readonly silicaWtPercent: number;
};

const M_MGO = 40.304;
const M_FEO = 71.844;
const M_FE2O3 = 159.687;
const FE2O3_TO_FEO = (2 * M_FEO) / M_FE2O3;

export const calculateMgNumberVsSilica = (
  input: MgNumberVsSilicaInput,
): MgNumberVsSilicaOutput => {
  for (const key of ["mgoWtPercent", "siO2WtPercent"] as const) {
    if (!(typeof input[key] === "number" && input[key] > 0))
      simpleError(
        key,
        "Values must be finite numbers greater than zero.",
        "invalid_oxide",
      );
  }
  if (!(input.feOWtPercent >= 0))
    simpleError("feOWtPercent", "FeO must be non-negative.", "invalid_oxide");
  if (!((input.fe2O3WtPercent ?? 0) >= 0))
    simpleError(
      "fe2O3WtPercent",
      "Fe2O3 must be non-negative.",
      "invalid_oxide",
    );
  const molMg = input.mgoWtPercent / M_MGO;
  const molFe =
    input.feOWtPercent / M_FEO + (2 * (input.fe2O3WtPercent ?? 0)) / M_FE2O3;
  const mgNumberMolar = (100 * molMg) / (molMg + molFe);
  return {
    mgNumberMolar,
    feOTotalWtPercent:
      input.feOWtPercent + FE2O3_TO_FEO * (input.fe2O3WtPercent ?? 0),
    silicaWtPercent: input.siO2WtPercent,
  };
};

export const mgNumberVsSilicaExample = {
  input: {
    mgoWtPercent: 6.5,
    feOWtPercent: 7.2,
    fe2O3WtPercent: 1.5,
    siO2WtPercent: 50,
  },
  output: {
    mgNumberMolar: 57.5407980178916,
    feOTotalWtPercent: 8.54971538071352,
    silicaWtPercent: 50,
  },
} satisfies ToolExample<MgNumberVsSilicaInput, MgNumberVsSilicaOutput>;

export const mgNumberVsSilicaTool = createSimpleTool({
  id: "geology/mg-number-vs-silica",
  title: "Mg Number Vs Silica Calculator",
  description:
    "Compute the molar Mg number (100*Mg/(Mg+Fe)) with ferric iron converted to ferrous, paired with SiO2 for differentiation-trend plots.",
  inputs: [
    {
      description: "MgO weight percent.",
      id: "mgoWtPercent",
      kind: "number",
      label: "MgO",
      minimum: 0,
    },
    {
      description: "FeO weight percent.",
      id: "feOWtPercent",
      kind: "number",
      label: "FeO",
      minimum: 0,
    },
    {
      default: 0,
      description: "Fe2O3 weight percent.",
      id: "fe2O3WtPercent",
      kind: "number",
      label: "Fe2O3",
      minimum: 0,
    },
    {
      description: "SiO2 weight percent.",
      id: "siO2WtPercent",
      kind: "number",
      label: "SiO2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Molar Mg number between 0 and 100.",
      id: "mgNumberMolar",
      kind: "number",
      label: "Mg number",
    },
    {
      description: "Total iron as FeO weight percent.",
      id: "feOTotalWtPercent",
      kind: "number",
      label: "FeO total",
    },
    {
      description: "SiO2 weight percent.",
      id: "silicaWtPercent",
      kind: "number",
      label: "SiO2",
    },
  ],
  calculate: (input) =>
    calculateMgNumberVsSilica(input as unknown as MgNumberVsSilicaInput),
});

export const runMgNumberVsSilica = mgNumberVsSilicaTool.execute;
export default mgNumberVsSilicaTool;

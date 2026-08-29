import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const StandardHydrogenElectrodeCorrectionTool = createSimpleTool({
  id: "chemistry/standard-hydrogen-electrode-correction",
  title: "Standard Hydrogen Electrode Correction Calculator",
  description:
    "Correct electrode potential via Nernst E = E0 - (0.0592/n)*log(Q).",
  inputs: [
    { id: "standardPotentialV", label: "E0", kind: "number", unit: "V" },
    {
      id: "electronsTransferred",
      label: "Electrons transferred",
      kind: "integer",
    },
    { id: "quotientQ", label: "Q", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "correctedPotentialV",
      label: "Corrected E",
      kind: "number",
      unit: "V",
    },
  ],
  calculate: (input) => {
    const electrons = input.electronsTransferred as number;
    const quotient = input.quotientQ as number;
    if (!(electrons > 0))
      simpleError(
        "electronsTransferred",
        "Electron count must be greater than zero.",
        "invalid_electron_count",
      );
    if (!(quotient > 0))
      simpleError(
        "quotientQ",
        "Reaction quotient must be greater than zero.",
        "invalid_quotient",
      );
    return {
      correctedPotentialV:
        (input.standardPotentialV as number) -
        (0.0592 / electrons) * Math.log10(quotient),
    };
  },
});
export default StandardHydrogenElectrodeCorrectionTool;
export const runStandardHydrogenElectrodeCorrection =
  StandardHydrogenElectrodeCorrectionTool.execute;

export type StandardHydrogenElectrodeCorrectionInput = {
  readonly standardPotentialV: number;
  readonly electronsTransferred: number;
  readonly quotientQ: number;
};

export type StandardHydrogenElectrodeCorrectionOutput = {
  readonly correctedPotentialV: number;
};

export const standardHydrogenElectrodeCorrectionExample = {
  input: {
    standardPotentialV: 1,
    electronsTransferred: 1,
    quotientQ: 1,
  },
  output: {
    correctedPotentialV: 1,
  },
} satisfies ToolExample<
  StandardHydrogenElectrodeCorrectionInput,
  StandardHydrogenElectrodeCorrectionOutput
>;

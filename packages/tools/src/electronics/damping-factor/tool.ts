import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DampingFactorInput = {
  readonly capacitanceF: number;
  readonly dampingResistanceOhms: number;
  readonly inductanceH: number;
};

export type DampingFactorOutput = {
  readonly dampingFactorZeta: number;
};

export const dampingFactorExample = {
  input: { capacitanceF: 0.0001, dampingResistanceOhms: 2, inductanceH: 0.01 },
  output: { dampingFactorZeta: 0.1 },
} satisfies ToolExample<DampingFactorInput, DampingFactorOutput>;

export const dampingFactorTool = createSimpleTool({
  calculate: (input) => {
    const { capacitanceF, dampingResistanceOhms, inductanceH } =
      input as unknown as DampingFactorInput;
    if (dampingResistanceOhms <= 0)
      simpleError(
        "dampingResistanceOhms",
        "Damping resistance must be positive.",
        "degenerate_input",
      );
    if (inductanceH <= 0)
      simpleError(
        "inductanceH",
        "Inductance must be positive.",
        "degenerate_input",
      );
    if (capacitanceF <= 0)
      simpleError(
        "capacitanceF",
        "Capacitance must be positive.",
        "degenerate_input",
      );
    return {
      dampingFactorZeta:
        dampingResistanceOhms / (2 * Math.sqrt(inductanceH / capacitanceF)),
    };
  },
  description:
    "Compute the RLC series damping ratio zeta from resistance, inductance, and capacitance.",
  id: "electronics/damping-factor",
  inputs: [
    {
      id: "dampingResistanceOhms",
      kind: "number",
      label: "Damping resistance",
      unit: "ohm",
    },
    { id: "inductanceH", kind: "number", label: "Inductance", unit: "H" },
    { id: "capacitanceF", kind: "number", label: "Capacitance", unit: "F" },
  ],
  outputs: [
    { id: "dampingFactorZeta", kind: "number", label: "Damping factor" },
  ],
  title: "Damping Factor",
});
export const runDampingFactor = dampingFactorTool.execute;
export default dampingFactorTool;

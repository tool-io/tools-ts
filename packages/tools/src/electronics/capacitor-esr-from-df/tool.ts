import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapacitorEsrFromDfInput = {
  readonly dissipationFactor: number;
  readonly frequencyHz: number;
  readonly capacitanceF: number;
};

export type CapacitorEsrFromDfOutput = {
  readonly esrOhms: number;
};

export const capacitorEsrFromDfExample = {
  input: { dissipationFactor: 0.05, frequencyHz: 1000, capacitanceF: 0.000001 },
  output: { esrOhms: 7.9577471545947684 },
} satisfies ToolExample<CapacitorEsrFromDfInput, CapacitorEsrFromDfOutput>;

export const capacitorEsrFromDfTool = createSimpleTool({
  id: "electronics/capacitor-esr-from-df",
  title: "ESR From Dissipation Factor",
  description:
    "Compute equivalent series resistance as dissipation factor / (2 x PI x frequency x capacitance).",
  inputs: [
    {
      id: "dissipationFactor",
      label: "Dissipation factor",
      kind: "number",
    },
    { id: "frequencyHz", label: "Frequency", kind: "number", unit: "Hz" },
    { id: "capacitanceF", label: "Capacitance", kind: "number", unit: "F" },
  ],
  outputs: [{ id: "esrOhms", label: "ESR", kind: "number", unit: "Ω" }],
  calculate: (input) => {
    const dissipationFactor = input.dissipationFactor as number;
    const frequencyHz = input.frequencyHz as number;
    const capacitanceF = input.capacitanceF as number;
    if (!(dissipationFactor > 0))
      simpleError(
        "dissipationFactor",
        "Dissipation factor must be positive.",
        "invalid_factor",
      );
    if (!(frequencyHz > 0))
      simpleError(
        "frequencyHz",
        "Frequency must be positive.",
        "invalid_frequency",
      );
    if (!(capacitanceF > 0))
      simpleError(
        "capacitanceF",
        "Capacitance must be positive.",
        "invalid_capacitance",
      );
    return {
      esrOhms: dissipationFactor / (2 * Math.PI * frequencyHz * capacitanceF),
    };
  },
});
export const runCapacitorEsrFromDf = capacitorEsrFromDfTool.execute;
export default capacitorEsrFromDfTool;

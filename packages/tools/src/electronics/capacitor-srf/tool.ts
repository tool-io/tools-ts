import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapacitorSrfInput = {
  readonly capacitanceNf: number;
  readonly lEquivalentNh: number;
};

export type CapacitorSrfOutput = {
  readonly selfResonantFreqMhz: number;
};

export const capacitorSrfExample = {
  input: { capacitanceNf: 100, lEquivalentNh: 100 },
  output: { selfResonantFreqMhz: 1.5915494309189533 },
} satisfies ToolExample<CapacitorSrfInput, CapacitorSrfOutput>;

export const calculateCapacitorSrf = (
  input: CapacitorSrfInput,
): CapacitorSrfOutput => {
  if (!(input.lEquivalentNh > 0))
    simpleError(
      "lEquivalentNh",
      "Equivalent series inductance must be positive.",
      "invalid_input",
    );
  if (!(input.capacitanceNf > 0))
    simpleError(
      "capacitanceNf",
      "Capacitance must be positive.",
      "invalid_input",
    );
  const fSi =
    1 /
    (2 *
      Math.PI *
      Math.sqrt(input.lEquivalentNh * 1e-9 * (input.capacitanceNf * 1e-9)));
  return { selfResonantFreqMhz: fSi / 1e6 };
};

export const capacitorSrfTool = createSimpleTool({
  calculate: (input) =>
    calculateCapacitorSrf(input as unknown as CapacitorSrfInput),
  description:
    "Compute the self-resonant frequency of a capacitor from its equivalent series inductance and capacitance.",
  id: "electronics/capacitor-srf",
  inputs: [
    {
      description: "Equivalent series inductance of the capacitor.",
      id: "lEquivalentNh",
      kind: "number",
      label: "Equivalent series inductance",
      unit: "nH",
    },
    {
      description: "Capacitance of the capacitor.",
      id: "capacitanceNf",
      kind: "number",
      label: "Capacitance",
      unit: "nF",
    },
  ],
  outputs: [
    {
      description: "Frequency where the capacitor resonates with its ESL.",
      format: "frequency",
      id: "selfResonantFreqMhz",
      kind: "number",
      label: "Self-resonant frequency",
      unit: "MHz",
    },
  ],
  title: "Capacitor SRF",
});
export const runCapacitorSrf = capacitorSrfTool.execute;
export default capacitorSrfTool;

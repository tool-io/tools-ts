import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InductorSrfInput = {
  readonly inductanceUh: number;
  readonly parasiticCapacitancePf: number;
};

export type InductorSrfOutput = {
  readonly selfResonantFreqMhz: number;
};

export const inductorSrfExample = {
  input: { inductanceUh: 1, parasiticCapacitancePf: 1 },
  output: { selfResonantFreqMhz: 159.15494309189538 },
} satisfies ToolExample<InductorSrfInput, InductorSrfOutput>;

export const calculateInductorSrf = (
  input: InductorSrfInput,
): InductorSrfOutput => {
  if (!(input.inductanceUh > 0))
    simpleError(
      "inductanceUh",
      "Inductance must be positive.",
      "invalid_input",
    );
  if (!(input.parasiticCapacitancePf > 0))
    simpleError(
      "parasiticCapacitancePf",
      "Parasitic capacitance must be positive.",
      "invalid_input",
    );
  const fSi =
    1 /
    (2 *
      Math.PI *
      Math.sqrt(
        input.inductanceUh * 1e-6 * (input.parasiticCapacitancePf * 1e-12),
      ));
  return { selfResonantFreqMhz: fSi / 1e6 };
};

export const inductorSrfTool = createSimpleTool({
  calculate: (input) =>
    calculateInductorSrf(input as unknown as InductorSrfInput),
  description:
    "Compute the self-resonant frequency of an inductor from its inductance and parasitic winding capacitance.",
  id: "electronics/inductor-srf",
  inputs: [
    {
      description: "Inductance of the coil.",
      id: "inductanceUh",
      kind: "number",
      label: "Inductance",
      unit: "µH",
    },
    {
      description: "Winding parasitic capacitance.",
      id: "parasiticCapacitancePf",
      kind: "number",
      label: "Parasitic capacitance",
      unit: "pF",
    },
  ],
  outputs: [
    {
      description:
        "Frequency where the inductor resonates with its parasitic capacitance.",
      format: "frequency",
      id: "selfResonantFreqMhz",
      kind: "number",
      label: "Self-resonant frequency",
      unit: "MHz",
    },
  ],
  title: "Inductor SRF",
});
export const runInductorSrf = inductorSrfTool.execute;
export default inductorSrfTool;

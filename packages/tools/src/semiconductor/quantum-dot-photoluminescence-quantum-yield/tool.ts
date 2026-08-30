import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuantumDotPhotoluminescenceQuantumYieldInput = Readonly<{
  readonly emittedPhotons: number;
  readonly absorbedPhotons: number;
}>;
export type QuantumDotPhotoluminescenceQuantumYieldOutput = Readonly<{
  readonly quantumYieldPercent: number;
}>;

export const calculateQuantumDotPhotoluminescenceQuantumYield = (
  x: QuantumDotPhotoluminescenceQuantumYieldInput,
): QuantumDotPhotoluminescenceQuantumYieldOutput => {
  if (!Number.isFinite(x.emittedPhotons) || x.emittedPhotons < 0)
    simpleError("emittedPhotons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.absorbedPhotons) || x.absorbedPhotons < 0)
    simpleError("absorbedPhotons", "Provide a finite number at least 0.");
  if (x.emittedPhotons > x.absorbedPhotons)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const quantumYieldPercent = (100 * x.emittedPhotons) / x.absorbedPhotons;
  if (!Number.isFinite(quantumYieldPercent))
    simpleError(
      "quantumYieldPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    quantumYieldPercent: Object.is(quantumYieldPercent, -0)
      ? 0
      : quantumYieldPercent,
  };
};

export const example = {
  input: { emittedPhotons: 80, absorbedPhotons: 100 },
  output: { quantumYieldPercent: 80 },
} satisfies ToolExample<
  QuantumDotPhotoluminescenceQuantumYieldInput,
  QuantumDotPhotoluminescenceQuantumYieldOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/quantum-dot-photoluminescence-quantum-yield",
  title: "Quantum Dot Photoluminescence Quantum Yield",
  description:
    "Photoluminescence quantum yield of a quantum-dot sample from emitted photons per absorbed excitation photon.",
  inputs: [
    {
      id: "emittedPhotons",
      kind: "number",
      label: "Emitted Photons",
      minimum: 0,
    },
    {
      id: "absorbedPhotons",
      kind: "number",
      label: "Absorbed Photons",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "quantumYieldPercent",
      kind: "number",
      label: "Quantum Yield Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateQuantumDotPhotoluminescenceQuantumYield({
      emittedPhotons: input.emittedPhotons as number,
      absorbedPhotons: input.absorbedPhotons as number,
    }),
});
export const quantumDotPhotoluminescenceQuantumYieldTool = tool;
export const runQuantumDotPhotoluminescenceQuantumYield = tool.execute;
export default tool;

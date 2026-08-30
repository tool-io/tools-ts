import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DetectorQuantumEfficiencyInput = Readonly<{
  readonly electrons: number;
  readonly incidentPhotons: number;
}>;
export type DetectorQuantumEfficiencyOutput = Readonly<{
  readonly quantumEfficiencyPercent: number;
}>;

export const calculateDetectorQuantumEfficiency = (
  x: DetectorQuantumEfficiencyInput,
): DetectorQuantumEfficiencyOutput => {
  if (!Number.isFinite(x.electrons) || x.electrons < 0)
    simpleError("electrons", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.incidentPhotons) ||
    !Number.isSafeInteger(x.incidentPhotons) ||
    x.incidentPhotons < 0
  )
    simpleError("incidentPhotons", "Provide a safe integer at least 0.");
  if (x.electrons > x.incidentPhotons)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const quantumEfficiencyPercent = (100 * x.electrons) / x.incidentPhotons;
  if (!Number.isFinite(quantumEfficiencyPercent))
    simpleError(
      "quantumEfficiencyPercent",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    quantumEfficiencyPercent: Object.is(quantumEfficiencyPercent, -0)
      ? 0
      : quantumEfficiencyPercent,
  };
};

export const example = {
  input: { electrons: 80, incidentPhotons: 100 },
  output: { quantumEfficiencyPercent: 80 },
} satisfies ToolExample<
  DetectorQuantumEfficiencyInput,
  DetectorQuantumEfficiencyOutput
>;

export const tool = createSimpleTool({
  id: "electronics/detector-quantum-efficiency",
  title: "Detector Quantum Efficiency",
  description:
    "Photon-to-electron quantum efficiency from counted collected electrons and incident photons.",
  inputs: [
    { id: "electrons", kind: "number", label: "Electrons", minimum: 0 },
    {
      id: "incidentPhotons",
      kind: "integer",
      label: "Incident Photons",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "quantumEfficiencyPercent",
      kind: "number",
      label: "Quantum Efficiency Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateDetectorQuantumEfficiency({
      electrons: input.electrons as number,
      incidentPhotons: input.incidentPhotons as number,
    }),
});
export const detectorQuantumEfficiencyTool = tool;
export const runDetectorQuantumEfficiency = tool.execute;
export default tool;

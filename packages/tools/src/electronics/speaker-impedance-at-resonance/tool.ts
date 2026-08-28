import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const speakerImpedanceAtResonanceExample = {
  input: { dcResistanceOhms: 6, qesFactor: 0.5, qmsFactor: 5 },
} satisfies ToolExample<{
  readonly dcResistanceOhms: number;
  readonly qesFactor: number;
  readonly qmsFactor: number;
}>;

export const speakerImpedanceAtResonanceTool = createSimpleTool({
  id: "electronics/speaker-impedance-at-resonance",
  title: "Resonance Impedance Peak",
  description:
    "Estimate a loudspeaker driver's low-frequency impedance peak as Zmax = Re x (1 + Qms / Qes), neglecting voice-coil inductance.",
  inputs: [
    {
      description: "Voice-coil DC resistance (Re).",
      id: "dcResistanceOhms",
      kind: "number",
      label: "DC Resistance",
      unit: "Ω",
    },
    {
      description: "Mechanical Q factor Qms; must be positive.",
      id: "qmsFactor",
      kind: "number",
      label: "Qms Factor",
    },
    {
      description: "Electrical Q factor Qes; must be positive.",
      id: "qesFactor",
      kind: "number",
      label: "Qes Factor",
    },
  ],
  outputs: [
    {
      description: "Impedance magnitude at free-air resonance.",
      id: "resonanceImpedanceOhms",
      kind: "number",
      label: "Peak Impedance",
      unit: "Ω",
    },
  ],
  calculate: (input) => {
    const dcResistanceOhms = input.dcResistanceOhms as number;
    const qmsFactor = input.qmsFactor as number;
    const qesFactor = input.qesFactor as number;
    if (!(dcResistanceOhms > 0))
      simpleError("dcResistanceOhms", "DC resistance must be positive.");
    if (!(qmsFactor > 0))
      simpleError("qmsFactor", "Qms factor must be positive.");
    if (!(qesFactor > 0))
      simpleError("qesFactor", "Qes factor must be positive.");
    return {
      resonanceImpedanceOhms: dcResistanceOhms * (1 + qmsFactor / qesFactor),
    };
  },
});
export const runSpeakerImpedanceAtResonance =
  speakerImpedanceAtResonanceTool.execute;
export default speakerImpedanceAtResonanceTool;

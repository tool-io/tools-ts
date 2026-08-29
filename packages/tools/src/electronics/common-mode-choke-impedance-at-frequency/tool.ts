import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    frequencyHz: 100000,
    commonModeInductanceH: 0.001,
    seriesResistanceOhm: 1,
  },
  output: { impedanceMagnitudeOhm: 628.31932649217 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/common-mode-choke-impedance-at-frequency",
  title: "Common-Mode Choke Impedance",
  description:
    "Estimate one winding's series RL impedance magnitude at frequency f as √[R²+(2πfL)²]. Enter the effective common-mode inductance and resistance at the operating point; real choke impedance also includes core loss, capacitance, and self-resonance.",
  inputs: [
    { id: "frequencyHz", kind: "number", label: "Frequency (Hz)", minimum: 0 },
    {
      id: "commonModeInductanceH",
      kind: "number",
      label: "Common-mode inductance (H)",
      minimum: 0,
    },
    {
      id: "seriesResistanceOhm",
      kind: "number",
      label: "Series resistance (Ω)",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "impedanceMagnitudeOhm",
      kind: "number",
      label: "Impedance Magnitude ohm",
    },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      impedanceMagnitudeOhm: Math.hypot(
        i.seriesResistanceOhm,
        2 * Math.PI * i.frequencyHz * i.commonModeInductanceH,
      ),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type CommonModeChokeImpedanceAtFrequencyInput = Readonly<
  typeof example.input
>;
export type CommonModeChokeImpedanceAtFrequencyOutput = Readonly<
  typeof example.output
>;
export const commonModeChokeImpedanceAtFrequencyTool = tool;
export const runCommonModeChokeImpedanceAtFrequency = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const opampNoninvertingGainExample = {
  input: { feedbackResistorOhms: 9000, gainResistorOhms: 1000 },
  output: { closedLoopGain: 10 },
} satisfies ToolExample<
  { readonly feedbackResistorOhms: number; readonly gainResistorOhms: number },
  { readonly closedLoopGain: number }
>;

export const opampNoninvertingGainTool = createSimpleTool({
  calculate: (input) => {
    const rg = input.gainResistorOhms as number;
    if (!(rg > 0))
      simpleError(
        "gainResistorOhms",
        "Gain resistance must be positive.",
        "invalid_resistance",
      );
    return {
      closedLoopGain: 1 + (input.feedbackResistorOhms as number) / rg,
    };
  },
  description:
    "Compute the ideal closed-loop gain of a non-inverting op-amp from its feedback and gain resistors.",
  id: "electronics/opamp-noninverting-gain",
  inputs: [
    {
      id: "feedbackResistorOhms",
      kind: "number",
      label: "Feedback resistor",
      unit: "Ω",
    },
    {
      id: "gainResistorOhms",
      kind: "number",
      label: "Gain resistor",
      unit: "Ω",
    },
  ],
  outputs: [
    { id: "closedLoopGain", kind: "number", label: "Closed-loop gain" },
  ],
  title: "Non-Inverting Op-Amp Gain",
});
export const runOpampNoninvertingGain = opampNoninvertingGainTool.execute;
export default opampNoninvertingGainTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const opampInvertingGainExample = {
  input: { feedbackResistorOhms: 100000, inputResistorOhms: 10000 },
  output: { closedLoopGain: -10 },
} satisfies ToolExample<
  { readonly feedbackResistorOhms: number; readonly inputResistorOhms: number },
  { readonly closedLoopGain: number }
>;

export const opampInvertingGainTool = createSimpleTool({
  calculate: (input) => {
    const rf = input.feedbackResistorOhms as number;
    const rin = input.inputResistorOhms as number;
    if (!(rf > 0))
      simpleError(
        "feedbackResistorOhms",
        "Feedback resistance must be positive.",
        "invalid_resistance",
      );
    if (!(rin > 0))
      simpleError(
        "inputResistorOhms",
        "Input resistance must be positive.",
        "invalid_resistance",
      );
    return { closedLoopGain: -(rf / rin) };
  },
  description:
    "Compute the ideal closed-loop gain of an inverting op-amp from its resistors.",
  id: "electronics/opamp-inverting-gain",
  inputs: [
    {
      id: "feedbackResistorOhms",
      kind: "number",
      label: "Feedback resistor",
      unit: "Ω",
    },
    {
      id: "inputResistorOhms",
      kind: "number",
      label: "Input resistor",
      unit: "Ω",
    },
  ],
  outputs: [
    { id: "closedLoopGain", kind: "number", label: "Closed-loop gain" },
  ],
  title: "Inverting Op-Amp Gain",
});
export const runOpampInvertingGain = opampInvertingGainTool.execute;
export default opampInvertingGainTool;

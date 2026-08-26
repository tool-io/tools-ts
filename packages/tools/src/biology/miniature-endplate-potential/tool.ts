import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const miniatureEndplatePotentialExample = {
  input: { eventCountInt: 48, sumAmplitudesMv: 12 },
  output: { meanAmplitudeMv: 0.25 },
} satisfies ToolExample<
  { readonly eventCountInt: number; readonly sumAmplitudesMv: number },
  { readonly meanAmplitudeMv: number }
>;

export const miniatureEndplatePotentialTool = createSimpleTool({
  id: "biology/miniature-endplate-potential",
  title: "MEPP Amplitude Mean",
  description:
    "Compute the mean miniature endplate potential amplitude by dividing the summed recorded amplitudes by the number of recorded events.",
  inputs: [
    {
      description:
        "Sum of all recorded miniature endplate potential amplitudes in millivolts; must not be negative.",
      id: "sumAmplitudesMv",
      label: "Summed amplitudes",
      kind: "number",
      minimum: 0,
      unit: "mV",
    },
    {
      description:
        "Number of recorded miniature endplate potential events; must be at least one.",
      id: "eventCountInt",
      label: "Event count",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Mean miniature endplate potential amplitude in millivolts.",
      id: "meanAmplitudeMv",
      label: "Mean amplitude",
      kind: "number",
      unit: "mV",
    },
  ],
  calculate: (input) => {
    const sumAmplitudesMv = input.sumAmplitudesMv as number;
    const eventCountInt = input.eventCountInt as number;
    return { meanAmplitudeMv: sumAmplitudesMv / eventCountInt };
  },
});
export const runMiniatureEndplatePotential =
  miniatureEndplatePotentialTool.execute;
export default miniatureEndplatePotentialTool;

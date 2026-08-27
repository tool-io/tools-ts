import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const workOfBreathingResistiveExample = {
  input: { inspiratoryFlowLs: 1, resistanceCmh2oLs: 5, tidalVolumeLiters: 0.5 },
  output: { resistiveWorkJoules: 0.24525000000000002 },
} satisfies ToolExample<
  {
    readonly inspiratoryFlowLs: number;
    readonly resistanceCmh2oLs: number;
    readonly tidalVolumeLiters: number;
  },
  { readonly resistiveWorkJoules: number }
>;

export const workOfBreathingResistiveTool = createSimpleTool({
  id: "biology/work-of-breathing-resistive",
  title: "Resistive WOB",
  description:
    "Compute resistive work of breathing per breath as resistance times inspiratory flow times tidal volume, converted to joules with 0.0981 J per cmH2O-L.",
  inputs: [
    {
      id: "resistanceCmh2oLs",
      label: "Airway resistance",
      kind: "number",
      unit: "cmH2O/L/s",
    },
    {
      id: "inspiratoryFlowLs",
      label: "Inspiratory flow",
      kind: "number",
      unit: "L/s",
    },
    {
      id: "tidalVolumeLiters",
      label: "Tidal volume",
      kind: "number",
      unit: "L",
    },
  ],
  outputs: [
    {
      id: "resistiveWorkJoules",
      label: "Resistive work per breath",
      kind: "number",
      unit: "J/breath",
    },
  ],
  calculate: (input) => {
    const resistanceCmh2oLs = input.resistanceCmh2oLs as number;
    const inspiratoryFlowLs = input.inspiratoryFlowLs as number;
    const tidalVolumeLiters = input.tidalVolumeLiters as number;
    if (resistanceCmh2oLs <= 0)
      simpleError(
        "resistanceCmh2oLs",
        "Airway resistance must be greater than zero.",
      );
    if (inspiratoryFlowLs <= 0)
      simpleError(
        "inspiratoryFlowLs",
        "Inspiratory flow must be greater than zero.",
      );
    if (tidalVolumeLiters <= 0)
      simpleError(
        "tidalVolumeLiters",
        "Tidal volume must be greater than zero.",
      );
    return {
      resistiveWorkJoules:
        resistanceCmh2oLs * inspiratoryFlowLs * tidalVolumeLiters * 0.0981,
    };
  },
});
export const runWorkOfBreathingResistive = workOfBreathingResistiveTool.execute;
export default workOfBreathingResistiveTool;

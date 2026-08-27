import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const complexPowerMagnitudeExample = {
  input: { realWatts: 3, reactiveVar: 4 },
} satisfies ToolExample<{
  readonly realWatts: number;
  readonly reactiveVar: number;
}>;

export const complexPowerMagnitudeTool = createSimpleTool({
  id: "electronics/complex-power-magnitude",
  title: "Complex Power Magnitude",
  description:
    "Calculate the magnitude of complex power from real and reactive power.",
  inputs: [
    { id: "realWatts", label: "Real power", kind: "number", unit: "W" },
    { id: "reactiveVar", label: "Reactive power", kind: "number", unit: "var" },
  ],
  outputs: [
    {
      id: "magnitudeVA",
      label: "Complex power magnitude",
      kind: "number",
      unit: "VA",
    },
  ],
  calculate: (input) => ({
    magnitudeVA: Math.hypot(
      input.realWatts as number,
      input.reactiveVar as number,
    ),
  }),
});
export const runComplexPowerMagnitude = complexPowerMagnitudeTool.execute;
export default complexPowerMagnitudeTool;

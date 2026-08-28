import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const seriesResonantImpedanceExample = {
  input: { windingResistanceOhms: 8 },
} satisfies ToolExample<{
  readonly windingResistanceOhms: number;
}>;

export const seriesResonantImpedanceTool = createSimpleTool({
  id: "electronics/series-resonant-impedance",
  title: "Series Resonance Impedance",
  description:
    "Compute the impedance in ohms of a series RLC circuit at resonance, where reactances cancel and only the winding resistance remains.",
  inputs: [
    {
      id: "windingResistanceOhms",
      label: "Winding resistance",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "impedanceAtResonanceOhms",
      label: "Impedance at resonance",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const windingResistanceOhms = input.windingResistanceOhms as number;
    if (windingResistanceOhms <= 0)
      simpleError(
        "windingResistanceOhms",
        "Winding resistance must be greater than zero.",
      );
    return { impedanceAtResonanceOhms: windingResistanceOhms };
  },
});
export const runSeriesResonantImpedance = seriesResonantImpedanceTool.execute;
export default seriesResonantImpedanceTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const geophoneNaturalPeriodResponseCornerLookupExample = {
  input: { naturalFrequencyHz: 4.5 },
  output: {
    flatBandLowHz: 1.2 * 4.5,
    cornerPeriodS: 1 / 4.5,
    classNote: "weak-motion / structural",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const geophoneNaturalPeriodResponseCornerLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ naturalFrequencyHz }) => {
      if (!(naturalFrequencyHz > 0))
        simpleError(
          "naturalFrequencyHz",
          "Natural frequency must be positive.",
        );
      const classNote =
        naturalFrequencyHz <= 1
          ? "broadband seismological"
          : naturalFrequencyHz <= 10
            ? "weak-motion / structural"
            : "reflection exploration";
      return {
        flatBandLowHz: 1.2 * naturalFrequencyHz,
        cornerPeriodS: 1 / naturalFrequencyHz,
        classNote,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Response corner and usable band for common geophone classes by natural frequency.",
  id: "seismology/geophone-natural-period-response-corner",
  inputs: [
    {
      minimum: 0,
      description: "Geophone natural frequency.",
      id: "naturalFrequencyHz",
      kind: "number",
      label: "f₀",
      unit: "Hz",
    },
  ],
  outputs: [
    {
      description: "Lower edge of the usable flat band (~1.2·f₀).",
      id: "flatBandLowHz",
      kind: "number",
      label: "f_low",
      unit: "Hz",
    },
    {
      description: "Corner period.",
      id: "cornerPeriodS",
      kind: "number",
      label: "T₀",
      unit: "s",
    },
    {
      description: "Typical deployment class.",
      id: "classNote",
      kind: "string",
      label: "Class",
    },
  ],
  title: "Geophone Natural Period Response Corner Lookup",
});
export const runGeophoneNaturalPeriodResponseCornerLookup =
  geophoneNaturalPeriodResponseCornerLookupTool.execute;
export { geophoneNaturalPeriodResponseCornerLookupExample as example };
export default geophoneNaturalPeriodResponseCornerLookupTool;

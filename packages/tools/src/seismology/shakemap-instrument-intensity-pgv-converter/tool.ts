import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const shakemapInstrumentIntensityPgvConverterExample = {
  input: { pgvCmS: 10 },
  output: { instrumentalMMI: 5.859999999999999, shakingLevel: "moderate" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const shakemapInstrumentIntensityPgvConverterTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ pgvCmS }) => {
      if (!(pgvCmS > 0))
        simpleError("pgvCmS", "Peak ground velocity must be positive.");
      const raw = 3.51 * Math.log10(pgvCmS) + 2.35;
      const mmi = Math.min(10, Math.max(1, raw));
      const level =
        mmi < 4
          ? "light"
          : mmi < 6
            ? "moderate"
            : mmi < 8
              ? "strong"
              : "violent";
      return { instrumentalMMI: mmi, shakingLevel: level };
    })(input as never) as Record<string, unknown>,
  description:
    "Convert PGV to instrumental intensity with the Wald et al. (1999) ShakeMap relation MMI = 3.51·log₁₀(PGV in cm/s) + 2.35, clamped to the displayed MMI range 1–10.",
  id: "seismology/shakemap-instrument-intensity-pgv-converter",
  inputs: [
    {
      minimum: 0,
      description: "Peak ground velocity.",
      id: "pgvCmS",
      kind: "number",
      label: "PGV",
      unit: "cm/s",
    },
  ],
  outputs: [
    {
      description: "Instrumental Modified Mercalli intensity.",
      id: "instrumentalMMI",
      kind: "number",
      label: "MMI",
    },
    {
      description: "Qualitative shaking descriptor.",
      id: "shakingLevel",
      kind: "string",
      label: "Shaking",
    },
  ],
  title: "ShakeMap Instrument Intensity PGV Converter",
});
export const runShakemapInstrumentIntensityPgvConverter =
  shakemapInstrumentIntensityPgvConverterTool.execute;
export { shakemapInstrumentIntensityPgvConverterExample as example };
export default shakemapInstrumentIntensityPgvConverterTool;

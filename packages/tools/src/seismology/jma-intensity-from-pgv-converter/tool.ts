import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const jmaIntensityFromPgvConverterExample = {
  input: { pgvCmS: 30 },
  output: { jmaIntensity: 6 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const jmaIntensityFromPgvConverterTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ pgvCmS }) => {
      if (!(pgvCmS > 0))
        simpleError("pgvCmS", "Peak ground velocity must be positive.");
      const raw = 2.68 * Math.log10(pgvCmS) + 2.29;
      return { jmaIntensity: Math.round(raw * 2) / 2 };
    })(input as never) as Record<string, unknown>,
  description:
    "Japan Meteorological Agency instrumental intensity from PGV (cm/s): I_JMA = 2.68·log₁₀(PGV) + 2.29 (approx).",
  id: "seismology/jma-intensity-from-pgv-converter",
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
      description: "JMA instrumental intensity (rounded to 0.5).",
      id: "jmaIntensity",
      kind: "number",
      label: "I_JMA",
    },
  ],
  title: "JMA Intensity From PGV Converter",
});
export const runJmaIntensityFromPgvConverter =
  jmaIntensityFromPgvConverterTool.execute;
export { jmaIntensityFromPgvConverterExample as example };
export default jmaIntensityFromPgvConverterTool;

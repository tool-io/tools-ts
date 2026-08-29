import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const surfaceWaveMagnitudeVk20FormulaExample = {
  input: { amplitudeNm: 10000, periodSeconds: 20, distanceDeg: 40 },
  output: { distanceValid: true, surfaceMagnitudeMs: 5.658389589940436 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const surfaceWaveMagnitudeVk20FormulaTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ amplitudeNm, periodSeconds, distanceDeg }) => {
      if (periodSeconds <= 0 || amplitudeNm <= 0 || distanceDeg <= 0)
        simpleError("periodSeconds", "All inputs must be positive.");
      const amplitudeUm = amplitudeNm / 1000;
      const ms =
        Math.log10(amplitudeUm / periodSeconds) +
        1.66 * Math.log10(distanceDeg) +
        3.3;
      return {
        surfaceMagnitudeMs: ms,
        distanceValid: distanceDeg >= 20 && distanceDeg <= 160,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Classic vertical-component Rayleigh surface-wave magnitude Ms = log10(A/T) + 1.66·log10(Δ°) + 3.3 with A in micrometres; nanometre input is converted to µm internally.",
  id: "seismology/surface-wave-magnitude-vk20-formula",
  inputs: [
    {
      minimum: 0,
      description: "Vertical Rayleigh amplitude (converted to µm internally).",
      id: "amplitudeNm",
      kind: "number",
      label: "A",
      unit: "nm",
    },
    {
      minimum: 0,
      description: "Wave period (18-22 s typical).",
      id: "periodSeconds",
      kind: "number",
      label: "T",
      unit: "s",
    },
    {
      minimum: 0,
      description: "Epicentral distance.",
      id: "distanceDeg",
      kind: "number",
      label: "Δ",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Surface-wave magnitude.",
      id: "surfaceMagnitudeMs",
      kind: "number",
      label: "M_s",
    },
    {
      description:
        "Whether distance lies in the 20-160 degree validity window.",
      id: "distanceValid",
      kind: "boolean",
      label: "Valid Δ?",
    },
  ],
  title: "Surface Wave Magnitude VK20 Formula Calculator",
});
export const runSurfaceWaveMagnitudeVk20Formula =
  surfaceWaveMagnitudeVk20FormulaTool.execute;
export { surfaceWaveMagnitudeVk20FormulaExample as example };
export default surfaceWaveMagnitudeVk20FormulaTool;
